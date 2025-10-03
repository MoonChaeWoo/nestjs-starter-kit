import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersEntity} from "./entities/users.entity";
import type {DeleteResult, UpdateResult} from "typeorm";

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
    getAllUser(): Promise<UsersEntity[]>{
        return this.usersService.getAllUsers();
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
    findUser(
        @Query() user: Partial<Pick<UsersEntity, 'uid' | 'email' | 'id'>>,
    ): Promise<UsersEntity | {}>{
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
    @Patch(':uid')
    updateUser(
        @Param('uid') uid: number,
        @Body() user : UpdateUserDto
    ): Promise<UsersEntity> {
        return this.usersService.updateUser(+uid, user);
    }

    /**
     * 회원 소프트 삭제
     * @param uid 삭제 대상 회원 UID (Param)
     * @returns UpdateResult
     * @example
     * DELETE http://localhost:3000/users/softDelete/1
     */
    @Delete('softDelete/:uid')
    softDelete(
        @Param('uid') uid: number
    ): Promise<UpdateResult> {
        return this.usersService.softDeleteUser(+uid);
    }

    /**
     * 회원 하드 삭제
     * @param uid 삭제 대상 회원 UID (Param)
     * @returns DeleteResult
     * @example
     * DELETE http://localhost:3000/users/hardDelete/1
     */
    @Delete('hardDelete/:uid')
    hardDelete(
        @Param('uid') uid: number
    ): Promise<DeleteResult> {
        return this.usersService.hardDeleteUser(+uid);
    }
}
