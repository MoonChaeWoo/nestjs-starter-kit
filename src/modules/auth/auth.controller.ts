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
    @Patch()
    @Post('update')
    updateUser(
        @Param('uid') uid: number,
        @Body()user: UpdateAuthDto
    ){
        return this.authService.updateUser(uid, user);
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
