import {Controller, Post, Body, Patch, Param, Res, Req, Get, ParseIntPipe, Delete} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {MailResponseType, SendMailType} from "../mail/types/mail-types.type";
import {CreateAuthDto} from "./dto/create-auth.dto";
import type {AuthUserType} from "./type/auth.type";
import {UpdateAuthDto} from "./dto/update-auth.dto";
import type {Response, Request} from "express";
import {UsersEntity} from "../users/entities/users.entity";
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthUserSwaggerDto} from "./dto/auth-user.swagger.dto";
import {SendMailSwaggerDto} from "./dto/send-mail.swagger.dto";
import {MailResponseSwaggerDto} from "./dto/mail-response.swagger.dto";

@ApiTags('Auth - 인증 관리')
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
    @ApiOperation({
        summary: '로그인',
        description: '이메일 또는 아이디와 비밀번호로 사용자 인증 후, accessToken과 refreshToken을 HttpOnly 쿠키로 발급합니다.'
    })
    @ApiBody({ type: AuthUserSwaggerDto })
    @ApiResponse({ status: 200, description: '인증 성공, 사용자 정보 반환', type: UsersEntity })
    loginUser(
        @Res({ passthrough: true }) res: Response,
        @Body() user: AuthUserType
    ): Promise<Pick<UsersEntity, 'email' | 'id' | 'nickname'>>{
        return this.authService.loginUser(res, user);
    }

    /**
     * 로그아웃
     *
     * - GET /auth/logout
     * - 사용자의 accessToken과 refreshToken 쿠키를 제거
     * - AuthService.logoutUser 호출
     *
     * @param res Response 객체 (passthrough: true로 반환값도 Nest가 처리)
     * @returns 로그아웃 완료 메시지와 성공 여부
     *
     * @example
     * GET /auth/logout
     * Response: { "message": "로그아웃이 완료되었습니다.", "success": true }
     */
    @Get('logout')
    @ApiOperation({
        summary: '로그아웃',
        description: '사용자의 accessToken과 refreshToken 쿠키를 제거하여 토큰을 삭제합니다.',
    })
    @ApiResponse({ status: 200, description: '로그아웃 성공, 쿠키 삭제 완료' })
    logoutUser(
        @Res({ passthrough: true }) res: Response
    ){
        return this.authService.logoutUser(res);
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
    @ApiOperation({
        summary: '메일 인증 번호 전송',
        description: '이메일로 인증번호 발송 후, 전송 결과 반환'
    })
    @ApiBody({ type: SendMailSwaggerDto })
    @ApiResponse({ status: 200, description: '메일 전송 결과', type: MailResponseSwaggerDto })
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
    @ApiOperation({
        summary: '사용자 인증',
        description: '이메일 또는 아이디와 비밀번호로 사용자 인증'
    })
    @ApiBody({ type: AuthUserSwaggerDto })
    @ApiResponse({ status: 200, description: '인증 성공, 사용자 정보 반환', type: UsersEntity })
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
    @ApiOperation({
        summary: '회원가입',
        description: '새로운 회원 생성'
    })
    @ApiBody({ type: CreateAuthDto })
    @ApiResponse({ status: 201, description: '회원가입 성공', type: Object })
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
    @ApiOperation({
        summary: '회원 정보 수정',
        description: '회원 정보를 수정합니다. 비밀번호 포함 시 해시 처리됨.'
    })
    @ApiParam({ name: 'uid', description: '수정할 회원 UID', example: 1 })
    @ApiBody({ type: UpdateAuthDto })
    @ApiResponse({ status: 200, description: '수정 완료, 성공 여부 반환', type: Object })
    updateUser(
        @Param('uid', ParseIntPipe) uid: number,
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
    @Delete('delete/:uid')
    @ApiOperation({
        summary: '회원 탈퇴 (소프트 삭제)',
        description: '회원 UID로 소프트 삭제를 수행합니다.'
    })
    @ApiParam({ name: 'uid', description: '삭제 대상 회원 UID', example: 1 })
    @ApiResponse({ status: 200, description: '탈퇴 완료, 성공 여부 반환', type: Object })
    deleteUser(
        @Param('uid', ParseIntPipe) uid: number,
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
    @ApiOperation({
        summary: 'JWT 토큰 유효성 검증',
        description: '요청 쿠키에 담긴 accessToken 검증 후 payload 반환'
    })
    @ApiResponse({ status: 200, description: '토큰 정상, payload 반환', type: Object })
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
    @ApiOperation({
        summary: 'JWT 토큰 재발급',
        description: `'access', 'refresh', 'all' 타입에 따라 토큰 재발급`
    })
    @ApiParam({ name: 'type', description: '재발급할 토큰 타입', example: 'all' })
    @ApiResponse({ status: 200, description: '토큰 재발급 성공', type: Object })
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