import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit,
    UnauthorizedException
} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {MailResponseType, SendMailType} from "../mail/types/mail-types.type";
import {AuthEmailContext, TokenType, VerificationData} from "./interface/auth.interface";
import {checkExpiredToken, checkExpiresAt, createContext} from "./utils/auth.utils";
import {CronExpression, SchedulerRegistry} from "@nestjs/schedule";
import {ConfigService} from "@nestjs/config";
import {CronJob} from "cron";
import {JwtService} from "@nestjs/jwt";
import {UsersEntity} from "../users/entities/users.entity";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {CreateAuthDto} from "./dto/create-auth.dto";
import {HASH_ROUNDS} from "./constants/auth.constants";
import {UpdateAuthDto} from "./dto/update-auth.dto";
import {Response} from "express";
import {RoleService} from "../role/role.service";
import {AuthenticateDto} from "./dto/authenticate-auth.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";

@Injectable()
export class AuthService implements OnModuleInit{
    private readonly logger = new Logger(AuthService.name);
    private readonly verificationMap = new Map<string, VerificationData>();
    public forceCookieReset : boolean = false;

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly roleService : RoleService,
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
     * 강제 쿠키 초기화 설정 처리
     *
     * - 내부 상태 변수(this.forceCookieReset)를 변경
     * - true일 경우, 로그인 또는 인증 시 쿠키를 강제로 초기화하도록 설정
     *
     * @param forceClear 강제 초기화 여부 (true | false)
     * @returns 설정 결과 메시지와 성공 여부
     *
     * @example
     * setForceCookieReset(true)
     * => { message: "강제 쿠키 초기화 설정 : true", success: true }
     */
    setForceCookieReset(forceClear : boolean) {
        try{
            this.forceCookieReset = forceClear;
            return {
                message : `강제 쿠키 초기화 설정 : ${this.forceCookieReset}`,
                success : true
            };
        }catch (error) {
            throw new InternalServerErrorException(error);
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
    generateToken(user: Pick<UsersEntity, 'email' | 'id' | 'uid'>, isRefreshToken : boolean): string {
        const payload = {
            email: user.email,
            id: user.id,
            uid: user.uid,
            token : isRefreshToken,
        };

        return 'Bearer ' + this.jwtService.sign(payload, {
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
    signToken(user: AuthenticateDto): TokenType {
        return {
            accessToken: this.generateToken(user, false),
            refreshToken: this.generateToken(user, true)
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
    async loginUser(res: Response, user: LoginAuthDto): Promise<Pick<UsersEntity, 'email' | 'id' | 'nickname'>>{
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
     * 로그아웃
     *
     * - GET /auth/logout
     * - 클라이언트에 저장된 accessToken, refreshToken 쿠키를 삭제(만료 처리)
     * - HttpOnly 옵션으로 설정된 쿠키이므로 클라이언트 JS에서는 접근 불가
     * - 로그아웃 완료 메시지 반환
     *
     * @param res 응답 객체 (HttpOnly 쿠키 제거에 사용)
     * @returns 로그아웃 성공 메시지와 성공 여부
     *
     * @example
     * GET /auth/logout
     * Response:
     * {
     *   "message": "로그아웃이 완료되었습니다.",
     *   "success": true
     * }
     */

    logoutUser(res: Response) {
        try{
            res.clearCookie('accessToken', {
                httpOnly: true,
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
            });

            return {
                message : '로그아웃이 완료되었습니다.',
                success : true
            };
        }catch (error) {
            this.logger.error('로그아웃 오류 발생 : ', error);
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
            const roles = await this.roleService.grantRolesToUser(user.role);
            await this.usersService.registerUser({...user, password : passwordHash, roles});

            return {message : "회원가입을 완료하였습니다.", success : true};
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
            let roles;
            if(user.role){
                roles = await this.roleService.grantRolesToUser(user.role);
            }

            await this.usersService.updateUser(uid, {...user, password : passwordHash, roles});

            return {message : "회원수정을 완료하였습니다.", success : true};
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
    async userAuthenticate(user: LoginAuthDto): Promise<UsersEntity> {
        try{
            if(!(user.email || user.id)) throw new Error('Email 또는 Id 둘중 하나는 필수 입력입니다.');

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
        }catch(error) {
            console.error('메일 발송 실패:', error);
            throw error;
        }
    }

    /**
     * 회원 탈퇴 처리 (소프트 삭제)
     *
     * - UsersService.softDeleteUser 호출
     * - 해당 uid 회원을 소프트 삭제 처리 (DB에서 완전 삭제하지 않고 삭제 플래그만 설정)
     *
     * @param userReq
     * @param uid 삭제할 회원의 UID
     * @returns 성공 메시지와 성공 여부 객체
     * @throws DB 삭제 오류 발생 시 예외 발생
     *
     * @example
     * deleteUser(1)
     * return { message: "회원탈퇴를 완료하였습니다.", success: true }
     */
    async deleteUser(userReq: Pick<UsersEntity, 'email' | 'id'>, uid: number) {
        try {
            await this.usersService.softDeleteUser(userReq, uid);
            return {message : "회원탈퇴를 완료하였습니다.", success : true};
        }catch (error) {
            console.error('회원 탈퇴 오류:', error);
            throw error;
        }
    }

    /**
     * JWT 토큰 검증
     *
     * - 전달받은 토큰이 유효한지 확인
     * - "Bearer " 또는 "Base " prefix 제거 후 검증 진행
     * - 유효하면 토큰 payload 객체 반환
     * - 토큰이 없거나 만료/위조 시 예외 발생
     *
     * @param token 검증할 JWT 토큰 문자열
     * @returns 토큰 payload 객체 (예: { email, id, iat, exp })
     * @throws BadRequestException 토큰이 전달되지 않은 경우
     * @throws UnauthorizedException 토큰 만료 또는 위조 시
     *
     * @example
     * verifyToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
     * // -> { email: "test@test.com", id: "user123", iat: 1696320000, exp: 1696323600 }
     *
     * // 토큰 만료 시 반환 예시
     * {
     *   "name": "TokenExpiredError",
     *   "message": "jwt expired",
     *   "expiredAt": "2025-10-03T08:34:52.000Z"
     * }
     */
    verifyToken(token : string){
        try{
            if(!token) throw new BadRequestException('검증할 토큰이 존재하지 않습니다.');
            token = token.replace(/^(base |bearer )/i, '');

            return this.jwtService.verify(token, {
                secret : this.configService.get('JWT_SECRET_KEY')
            });
        }catch(error){
            this.logger.error('토큰 만료 또는 검증 오류 : ', error);
            throw error;
        }
    }

    /**
     * 토큰 재발급
     *
     * - access, refresh, all 중 하나를 선택하여 재발급
     * - refreshToken 검증 후 유효하면 새로운 토큰 발급
     * - HTTP Only 쿠키로 브라우저에 저장
     *
     * @param res Response 객체 (NestJS Response)
     * @param type 'access' | 'refresh' | 'all' 재발급할 토큰 유형
     * @param tokens 기존 accessToken과 refreshToken
     * @param returnToken 토큰 반환할지 여부
     * @throws BadRequestException: 토큰 미존재 또는 type 오류
     * @throws UnauthorizedException: 토큰 만료 또는 검증 실패
     *
     * @example
     * // 모든 토큰 재발급
     * GET /auth/token/reissue/all
     * 쿠키: accessToken, refreshToken 새로 발급
     */
    async reissueToken(res: Response, type : 'access' | 'refresh'| 'all', tokens: TokenType, returnToken = false) {
        try{
            if(!(tokens.accessToken || tokens.refreshToken)) throw new BadRequestException('검증할 토큰이 존재하지 않습니다.');
            tokens.refreshToken = tokens.refreshToken.replace(/^(base |bearer )/i, '');

            const refreshCheckResult = await checkExpiredToken(tokens.refreshToken);
            if(refreshCheckResult.pass){
                const accessToken = this.generateToken(refreshCheckResult.payload, false);
                const refreshToken = this.generateToken(refreshCheckResult.payload, true);

                if(type === 'access'){
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                    });
                }else if(type === 'refresh'){
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                    });
                }else if(type === 'all'){
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                    });
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                    });
                }else{
                    throw new BadRequestException('재발급할 토큰의 유형을 지정해 주세요.')
                }
                if(returnToken){
                    return {message : "토큰 재발급이 완료하였습니다.", success : true, tokens : {accessToken, refreshToken}};
                }else{
                    return {message : "토큰 재발급이 완료하였습니다.", success : true};
                }
            }else{
                throw new UnauthorizedException('로그인을 다시 진행해 주세요.');
            }
        }catch(error){
            this.logger.error('모든 토큰 만료 또는 검증 오류 : ', error);
            throw error;
        }
    }
}