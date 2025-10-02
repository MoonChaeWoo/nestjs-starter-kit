import {Injectable, Logger, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {MailResponseType, SendMailType} from "../mail/types/mail-types.type";
import {AuthEmailContext, TokenType, VerificationData} from "./interface/auth.interface";
import {checkExpiresAt, createContext} from "./utils/auth.utils";
import {CronExpression, SchedulerRegistry} from "@nestjs/schedule";
import {ConfigService} from "@nestjs/config";
import {CronJob} from "cron";
import {JwtService} from "@nestjs/jwt";
import {UsersEntity} from "../users/entities/users.entity";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {CreateAuthDto} from "./dto/create-auth.dto";
import {HASH_ROUNDS} from "./constants/auth.constants";
import {AuthUserType} from "./type/auth.type";
import {UpdateAuthDto} from "./dto/update-auth.dto";
import {Response} from "express";

@Injectable()
export class AuthService implements OnModuleInit{
    private readonly logger = new Logger(AuthService.name);
    private readonly verificationMap = new Map<string, VerificationData>();

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly schedulerRegistry: SchedulerRegistry
    ) {}

    /**
     * 모듈 초기화 시 실행됨
     *
     * 메일 인증 기능 켜져 있으면 인증 코드 만료 체크하는 스케줄러 등록함
     *
     * - 매 분 실행 (EVERY_MINUTE)
     * - checkExpiresAt 호출해서 verificationMap의 만료 코드 제거 (10분 기준)
     * - 오류 발생하면 logger에 기록
     */
    onModuleInit(): void {
        const useEmailVerified = this.configService.get('USE_EMAIL_VERIFIED') === 'true';
        if(useEmailVerified){
            const jobName = 'checkExpiresEmail';
            const job = new CronJob(CronExpression.EVERY_MINUTE, () => {
                try{
                    checkExpiresAt(this.verificationMap, 10);
                }catch(error){
                    this.logger.error('Cron 작업 실패 : ', error);
                }
            });

            this.schedulerRegistry.addCronJob(jobName, job);
            job.start();
        }
    }

    /**
     * 단일 JWT 토큰 생성
     *
     * 액세스 토큰 또는 리프레시 토큰을 구분하여 payload와 만료 시간을 설정함.
     * 내부 헬퍼 용도로 사용, 직접 클라이언트에 반환하지 않음.
     *
     * @param user 토큰에 포함할 사용자 정보 (email, id)
     * @param isRefreshToken true면 리프레시 토큰, false면 액세스 토큰
     * @returns 생성된 JWT 문자열
     */
    generateToken(user: Pick<UsersEntity, 'email' | 'id'>, isRefreshToken : boolean): string {
        const payload = {
            email: user.email,
            id: user.id,
            token : isRefreshToken,
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: isRefreshToken ? '1d' : '15m',
            algorithm: 'HS512'
        });
    }

    /**
     * 인증 완료 후 클라이언트 전달용 토큰 세트 생성
     *
     * 액세스 토큰과 리프레시 토큰을 동시에 발급함.
     * 실제 로그인 응답에 사용.
     *
     * @param user 인증된 사용자 정보 (email, id, password)
     * @returns accessToken, refreshToken 포함 객체
     */
    signToken(user: AuthUserType): TokenType{
        return {
            accessToken : this.generateToken(user, false),
            refreshToken : this.generateToken(user, true)
        }
    }

    /**
     * 사용자 인증 및 토큰 발급
     *
     * - AuthService에서 호출
     * - 유효한 사용자 확인 후 JWT 토큰 발급
     * - accessToken, refreshToken 쿠키 설정
     *
     * @param res Response 객체 (쿠키 설정용)
     * @param user 인증 정보 (email 또는 id, password)
     * @returns { email, id, nickname } 인증된 사용자 정보
     * @throws 인증 실패 시 UnauthorizedException 또는 기타 예외 발생
     */
    async loginUser(res: Response, user: AuthUserType): Promise<Pick<UsersEntity, 'email' | 'id' | 'nickname'>>{
        try{
            const targetUser = await this.userAuthenticate(user);
            const {accessToken, refreshToken} = this.signToken(targetUser);

            res.cookie('accessToken', accessToken, {
               httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
            });

            return {
                email: targetUser.email,
                id: targetUser.id,
                nickname: targetUser.nickname,
            };
        }catch(error){
            this.logger.error('로그인 실패 : ', error);
            throw error;
        }
    }

    /**
     * 사용자 회원가입 처리
     *
     * 전달받은 사용자 정보를 기반으로 비밀번호를 해시 처리 후
     * UsersService의 registerUser를 호출하여 DB에 사용자 생성
     * 오류 발생 시 로거에 기록 후 예외를 그대로 던짐
     *
     * @param user 회원가입 시 전달된 사용자 정보 (CreateAuthDto)
     * @returns 생성된 UsersEntity
     */
    async registerUser(user : CreateAuthDto):Promise<{message : string, success : boolean}>{
        try{
            const passwordHash = await bcrypt.hash(
                user.password,
                HASH_ROUNDS
            );
            await this.usersService.registerUser({...user, password : passwordHash});

            return {message : "회원가입에 성공하였습니다.", success : true};
        }catch(error){
            this.logger.error('회원가입 실패 : ', error);
            throw error;
        }
    }

    /**
     * 회원 정보 업데이트
     *
     * - 비밀번호가 포함된 경우 bcrypt로 해싱 후 저장
     * - UsersService.updateUser 호출
     *
     * @param uid 수정할 회원 UID
     * @param user 수정할 회원 정보 (UpdateAuthDto)
     * @returns { message: string, success: boolean }
     * @throws DB 저장 실패 시 예외 발생
     */
    async updateUser(uid: number, user : UpdateAuthDto):Promise<{message : string, success : boolean}>{
        try {
            const passwordHash = await bcrypt.hash(
                user.password,
                HASH_ROUNDS
            );
            await this.usersService.updateUser(uid, {...user, password : passwordHash});

            return {message : "회원수정에 성공하였습니다.", success : true};
        }catch (error) {
            this.logger.error('회원정보 수정 실패 : ', error);
            throw error;
        }
    }

    /**
     * 유저 인증 처리
     *
     * email 또는 id 중 하나로 회원 조회 후, 비밀번호 확인
     * - email, id 둘 다 없으면 Error 던짐
     * - 조회된 유저가 없으면 UnauthorizedException 던짐
     * - 비밀번호가 일치하지 않으면 UnauthorizedException 던짐
     *
     * @param user - 인증에 사용할 유저 정보 (email 또는 id, password 필수)
     * @returns 인증된 UsersEntity
     * @throws Error | UnauthorizedException
     */
    async userAuthenticate(user: AuthUserType): Promise<UsersEntity> {
        try{
            if(!(user.email || user.id)) throw new Error('email 또는 id 둘중 하나는 필수 입력');

            const targetUser: {} | UsersEntity = await this.usersService.findUser(user);
            if(!('uid' in targetUser)) throw new UnauthorizedException('존재하지 않는 회원입니다.');

            const authResult: boolean = await bcrypt.compare(user.password, targetUser.password);
            if(!authResult) throw new UnauthorizedException('회원 정보가 일치하지 않습니다.');

            return targetUser;
        }catch(error){
            this.logger.error('유저 인증 실패 : ', error);
            throw error;
        }
    }

    /**
     * 인증 번호 메일 전송함
     *
     * - sendMailDto.template이 'auth'면 'auth-email'로 바꾸고 context 생성
     * - verificationMap 기반으로 인증 코드 context 합침
     * - 메일 전송 실패 시 handleMailError로 예외 던짐
     *
     * @param sendMailDto 전송할 메일 정보
     * @returns 메일 전송 결과 (accepted, rejected, messageId)
     */
    async sendAuthEmail(sendMailDto: SendMailType): Promise<MailResponseType> {
        if('template' in sendMailDto && sendMailDto.template === 'auth'){
            sendMailDto.template = 'auth-email';
            sendMailDto.context = {...createContext(this.verificationMap, sendMailDto.from), ...sendMailDto.context} as AuthEmailContext;
        }

        try {
            const result = await this.mailerService.sendMail(sendMailDto);
            return {
                accepted: result.accepted,
                rejected: result.rejected,
                messageId: result.messageId,
            };
        }catch(error: any) {
            console.error('메일 발송 실패:', error);
            throw error;
        }
    }
}