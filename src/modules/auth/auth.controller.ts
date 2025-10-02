import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {MailResponseType, SendMailType} from "../mail/types/mail-types.type";
import {CreateAuthDto} from "./dto/create-auth.dto";
import type {AuthUserType} from "./type/auth.type";
import {TokenType} from "./interface/auth.interface";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /**
     * 인증 번호 메일 전송
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
     * 로그인
     *
     * - POST /auth/login
     * - 이메일 또는 아이디와 비밀번호로 인증
     * - 인증 성공 시 액세스/리프레시 토큰 발급
     *
     * @param user 로그인 정보 (email 또는 id, password)
     * @returns TokenType { accessToken, refreshToken }
     * @example
     * POST http://localhost:3000/auth/login
     * Body: {
     *   "email": "user@example.com",
     *   "password": "password123"
     * }
     */
    @Post('login')
    loginUser(
        @Body() user: AuthUserType
    ): Promise<TokenType>{
        return this.authService.loginUser(user);
    }

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

}
