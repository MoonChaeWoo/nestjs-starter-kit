import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersEntity} from "./entities/users.entity";
import {DeleteResult, UpdateResult} from "typeorm";
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {BearerTokenGuard} from "../auth/guard/bearer-token.guard";
import {User} from "./decorator/user.decorator";
import type {USER_REQ} from "../auth/type/auth.type";
import {AdminUserDto} from "./dto/admin-user.dto";

@ApiTags('Users - 사용자 관리')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    /**
     * 모든 회원 조회
     * @returns UsersEntity 배열
     * @example
     * GET http://localhost:3000/users
     */
    @Get()
    @UseGuards(BearerTokenGuard)
    @ApiOperation({ summary: '모든 사용자 조회', description: 'DB에 저장된 모든 사용자 목록을 반환합니다.' })
    @ApiResponse({ status: 200, description: '회원 목록 반환', type: [AdminUserDto] })
    getAllUser(
        @User() userReq: USER_REQ,
    ): Promise<AdminUserDto[]>{
        return this.usersService.getAllUsers(userReq);
    }

    /**
     * 회원 검색
     * uid, email, id 중 일부 또는 전부로 검색
     * @param user 검색 조건 (Query String)
     * @returns UsersEntity 존재하면 반환, 없으면 빈 객체 {}
     * @example
     * GET http://localhost:3000/users/search?uid=1
     * GET http://localhost:3000/users/search?email=test@example.com
     */
    @Get('search')
    @ApiOperation({
        summary: '회원 검색',
        description: 'uid, email, id 중 하나 또는 여러 조건을 사용하여 회원 정보를 검색합니다.'})
    @ApiQuery({ name: 'uid', required: false, example: 1, description: '회원 UID' })
    @ApiQuery({ name: 'email', required: false, example: 'test@example.com', description: '회원 이메일' })
    @ApiQuery({ name: 'id', required: false, example: 'user123', description: '회원 아이디' })
    @ApiResponse({ status: 200, description: '검색된 회원 반환', type: UsersEntity })
    findUser(
        @Query() user: Partial<USER_REQ>,
    ): Promise<AdminUserDto | {}>{
        return this.usersService.findUser(user);
    }

    /**
     * 회원 등록
     * @param user 회원가입 DTO
     * @returns 생성된 UsersEntity
     * @example
     * POST http://localhost:3000/users
     * Body: { "email": "test@example.com", "id": "user123", "nickname": "tester", "password": "pass123" }
     */
    @Post()
    @ApiOperation({
        summary: '회원 등록',
        description: '새로운 사용자를 등록합니다. 이메일, 아이디, 닉네임, 비밀번호를 포함해야 합니다.'
    })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: '회원 생성 완료', type: UsersEntity })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    registerUser(
        @Body() user : CreateUserDto
    ): Promise<UsersEntity> {
        return this.usersService.registerUser(user);
    }

    /**
     * 회원 정보 업데이트
     * @param uid 수정 대상 회원 UID (Param)
     * @param user 수정할 데이터 (Body)
     * @returns 수정 완료된 UsersEntity
     * @example
     * PATCH http://localhost:3000/users/1
     * Body: { "nickname": "newNickname" }
     */
    @Patch('update/:uid')
    @ApiOperation({
        summary: '회원 정보 업데이트',
        description: '회원 UID로 특정 사용자를 찾아 닉네임 등 정보를 수정합니다.'
    })
    @ApiParam({ name: 'uid', description: '수정 대상 회원 UID', example: 1 })
    @ApiBody({ type: UpdateUserDto, description: '수정할 데이터' })
    @ApiResponse({ status: 200, description: '회원 정보 수정 완료', type: UsersEntity })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    updateUser(
        @Param('uid', ParseIntPipe) uid: number,
        @Body() user : UpdateUserDto
    ): Promise<UsersEntity> {
        return this.usersService.updateUser(uid, user);
    }

    /**
     * 회원 소프트 삭제
     * @param userReq
     * @param uid 삭제 대상 회원 UID (Param)
     * @returns UpdateResult
     * @example
     * DELETE http://localhost:3000/users/softDelete/1
     */
    @Delete('softDelete/:uid')
    @UseGuards(BearerTokenGuard)
    @ApiOperation({
        summary: '회원 소프트 삭제',
        description: '회원 UID로 특정 사용자를 소프트 삭제(논리 삭제)합니다.'
    })
    @ApiParam({ name: 'uid', description: '삭제 대상 회원 UID', example: 1 })
    @ApiResponse({ status: 200, description: '회원 소프트 삭제 완료', type: UpdateResult })
    softDelete(
        @User() userReq: USER_REQ,
        @Param('uid', ParseIntPipe) uid: number
    ): Promise<UpdateResult> {
        return this.usersService.softDeleteUser(userReq, uid);
    }

    /**
     * 회원 하드 삭제
     * @param userReq
     * @param uid 삭제 대상 회원 UID (Param)
     * @returns DeleteResult
     * @example
     * DELETE http://localhost:3000/users/hardDelete/1
     */
    @Delete('hardDelete/:uid')
    @UseGuards(BearerTokenGuard)
    @ApiOperation({
        summary: '회원 하드 삭제',
        description: '회원 UID로 특정 사용자를 하드 삭제(데이터 완전 삭제)합니다.'
    })
    @ApiParam({ name: 'uid', description: '삭제 대상 회원 UID', example: 1 })
    @ApiResponse({ status: 200, description: '회원 하드 삭제 완료', type: DeleteResult })
    hardDelete(
        @User() userReq: USER_REQ,
        @Param('uid', ParseIntPipe) uid: number
    ): Promise<DeleteResult> {
        return this.usersService.hardDeleteUser(userReq, uid);
    }

}
