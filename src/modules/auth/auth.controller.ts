import {Controller, Post, Body, Patch, Param, Res, Req, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {MailResponseType, SendMailType} from "../mail/types/mail-types.type";
import {CreateAuthDto} from "./dto/create-auth.dto";
import type {AuthUserType} from "./type/auth.type";
import {UpdateAuthDto} from "./dto/update-auth.dto";
import type {Response, Request} from "express";
import {UsersEntity} from "../users/entities/users.entity";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    /** ===================== 인증 ===================== */
    /**
     * 로그인
     *
     * - POST /auth/login
     * - 이메일 또는 아이디와 비밀번호로 사용자 인증
     * - 인증 성공 시 accessToken, refreshToken을 HttpOnly 쿠키로 발급
     * - 사용자 이메일, 아이디, 닉네임 반환
     *
     * @param res Response 객체 (쿠키 설정용)
     * @param user 로그인 정보 (email 또는 id, password)
     * @returns { email, id, nickname } 인증된 사용자 정보
     *
     * @example
     * POST http://localhost:3000/auth/login
     * Body:
     * {
     *   "email": "user@example.com",
     *   "password": "password123"
     * }
     *
     * Response:
     * {
     *   "email": "user@example.com",
     *   "id": "user01",
     *   "nickname": "유저닉네임"
     * }
     *
     * - 성공 시 accessToken, refreshToken이 HttpOnly 쿠키에 설정됨
     * - 실패 시 예외 발생
     */
    @Post('login')
    loginUser(
        @Res({ passthrough: true }) res: Response,
        @Body() user: AuthUserType
    ): Promise<Pick<UsersEntity, 'email' | 'id' | 'nickname'>>{
        return this.authService.loginUser(res, user);
    }

    /**
     * 메일 인증 번호 전송
     *
     * - POST /auth/mail
     * - body로 SendMailType 객체 받음
     * - AuthService.sendAuthEmail 호출 후 결과 반환
     *
     * @param sendMailDto 전송할 메일 정보
     * @returns MailResponseType (accepted, rejected, messageId)
     * @example
     * POST http://localhost:3000/auth/mail
     * Body: {
     *   "from": "no-reply@example.com",
     *   "to": "user@example.com",
     *   "subject": "인증번호 발송",
     *   "template": "auth",
     *   "context": { "name": "사용자" }
     * }
     */
    @Post('mail')
    sendAuthEmail(
        @Body() sendMailDto: SendMailType
    ): Promise<MailResponseType> {
        return this.authService.sendAuthEmail(sendMailDto);
    }

    /**
     * 사용자 인증
     *
     * - POST /auth/authenticate
     * - 이메일 또는 아이디와 비밀번호 확인
     *
     * @param user 인증 정보 (email 또는 id, password)
     * @returns 회원 정보
     * @example
     * POST http://localhost:3000/auth/authenticate
     * Body: {
     *   "email": "user@example.com",
     *   "password": "password123"
     * }
     */
    @Post('authenticate')
    userAuthenticate(
        @Body()user: AuthUserType
    ){
        return this.authService.userAuthenticate(user);
    }

    /** ===================== 회원 가입, 수정, 탈퇴 ===================== */
    /**
     * 회원가입
     *
     * - POST /auth/register
     * - 새로운 회원 생성
     *
     * @param user 회원가입 정보
     * @returns { message: string } 회원가입 성공 메시지
     * @example
     * POST http://localhost:3000/auth/register
     * Body: {
     *   "email": "user@example.com",
     *   "id": "user123",
     *   "nickname": "tester",
     *   "password": "password123"
     * }
     */
    @Post('register')
    registerUser(
        @Body()user: CreateAuthDto
    ){
        return this.authService.registerUser(user);
    }

    /**
     * 회원 정보 수정
     *
     * - PATCH /auth/update/:uid
     * - 회원의 정보를 수정 (비밀번호 포함 시 해시 처리됨)
     * - 수정 성공 시 성공 메시지와 success 여부 반환
     *
     * @param uid 수정할 회원 UID
     * @param user 수정할 회원 정보 (UpdateAuthDto)
     * @returns { message: string, success: boolean }
     *
     * @example
     * PATCH http://localhost:3000/auth/update/1
     * Body: {
     *   "email": "updated@example.com",
     *   "nickname": "newNick",
     *   "password": "newPassword123"
     * }
     *
     * Response: {
     *   "message": "회원수정에 성공하였습니다.",
     *   "success": true
     * }
     */
    @Patch('update/:uid')
    updateUser(
        @Param('uid') uid: number,
        @Body()user: UpdateAuthDto
    ){
        return this.authService.updateUser(uid, user);
    }

    /**
     * 회원 탈퇴 (소프트 삭제)
     *
     * - GET /auth/delete/:uid
     * - path parameter로 회원 UID 전달
     * - AuthService의 deleteUser 호출
     *
     * @param uid 삭제할 회원의 UID
     * @returns 회원 탈퇴 성공 메시지와 성공 여부
     *
     * @example
     * GET /auth/delete/1
     * Response: { "message": "회원탈퇴를 완료하였습니다.", "success": true }
     */
    @Get('delete/:uid')
    deleteUser(
        @Param('uid') uid: number,
    ){
        return this.authService.deleteUser(uid);
    }

    /**
     * 액세스 토큰 유효성 검증 API
     *
     * - 요청 쿠키(`accessToken`)에 담긴 JWT를 검증한다.
     * - 유효한 경우: 토큰 payload(디코딩된 객체)를 반환한다.
     * - 유효하지 않거나 만료된 경우: 401 Unauthorized 예외를 발생시킨다.
     *
     * @route GET /auth/verify
     * @returns {object} JWT payload (정상일 경우)
     *
     * 성공 응답 예시:
     * {
     *   "sub": 1,
     *   "email": "test@example.com",
     *   "iat": 1735900000,
     *   "exp": 1735903600
     * }
     *
     * 실패 응답 예시:
     * {
     *   "statusCode": 401,
     *   "message": "Unauthorized",
     *   "error": {
     *     "name": "TokenExpiredError",
     *     "message": "jwt expired",
     *     "expiredAt": "2025-10-03T08:34:52.000Z"
     *   }
     * }
     */
    @Get('token/verify')
    verifyToken(
        @Req() req: Request
    ){
        return this.authService.verifyToken(req.cookies.accessToken);
    }

    /**
     * JWT 토큰 재발급 API
     *
     * - 쿠키에 있는 accessToken, refreshToken을 기반으로 토큰 재발급
     * - type에 따라 재발급할 토큰 지정 가능
     *   - 'access' : accessToken만 재발급
     *   - 'refresh' : refreshToken만 재발급
     *   - 'all' : accessToken과 refreshToken 모두 재발급
     * - refreshToken이 만료되었거나 검증 실패 시 UnauthorizedException 발생
     *
     * @route GET /auth/token/reissue/:type
     * @param res
     * @param req
     * @param type 재발급할 토큰 유형 ('access' | 'refresh' | 'all')
     * @returns 쿠키로 재발급된 토큰 세팅
     *
     * 요청 예시:
     * GET /auth/token/reissue/all
     * 쿠키: accessToken=xxx; refreshToken=yyy;
     *
     * 성공 시 응답: (쿠키에 새 토큰 세팅됨)
     * {
     *   "message": "Tokens reissued successfully"
     * }
     *
     * 실패 예시 (refreshToken 만료):
     * {
     *   "statusCode": 401,
     *   "message": "Unauthorized",
     *   "error": {
     *     "name": "TokenExpiredError",
     *     "message": "jwt expired",
     *     "expiredAt": "2025-10-03T09:00:00.000Z"
     *   }
     * }
     */
    @Get('token/reissue/:type')
    reissueToken(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
        @Param('type') type : 'access' | 'refresh' | 'all',
    ){
        return this.authService.reissueToken(res, type, {
            accessToken: req.cookies.accessToken,
            refreshToken: req.cookies.refreshToken
        });
    }

    // test
    // @Get('check-cookie')
    // checkCookie(@Req() req: Request) {
    //     // 브라우저가 보내준 쿠키
    //     console.log(req.headers.cookie);
    //     // 또는 개별 쿠키
    //     console.log(req.cookies.accessToken);
    //     console.log(req.cookies.refreshToken);
    //
    //     return { cookies: req.cookies };
    // }
}
//