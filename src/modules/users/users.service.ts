import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "./entities/users.entity";
import type {DeleteResult, Repository, UpdateResult} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
    ) {}

    /**
     * 모든 회원 조회
     * @returns UsersEntity 배열
     * @throws DB 조회 오류 시 handleUserDbError 호출
     */
    async getAllUsers(): Promise<UsersEntity[]>{
        try{
            return await this.usersRepository.find();
        }catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 회원 조회
     * uid, email, id 중 일부 또는 전부로 검색
     * @param user 검색 조건
     * @returns UsersEntity 존재하면 반환, 없으면 빈 객체 {}
     * @throws DB 조회 오류 시 handleUserDbError 호출
     */
    async findUser(user: Partial<Pick<UsersEntity, 'uid' | 'email' | 'id'>>): Promise<UsersEntity | {}>{
        try{
            const findUser = await this.usersRepository.findOne({
                where : {
                    email : user.email,
                    id : user.id,
                    uid : user.uid
                }
            });

            return findUser ?? {} ;
        }catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 회원 등록
     * @param userDto 회원 생성 DTO
     * @returns 생성된 UsersEntity
     * @throws DB 저장 오류 시 handleUserDbError 호출
     */
    async registerUser(userDto : CreateUserDto): Promise<UsersEntity>{
        try{
            if(userDto.nickname) {
                const checkNick = await this.usersRepository.exists({
                    where: {
                        nickname : userDto.nickname,
                    }
                });
                if(checkNick) throw new BadRequestException('이미 존재하는 닉네임입니다.');
            }else if(userDto.email) {
                const checkEmail = await this.usersRepository.exists({
                    where: {
                        email : userDto.email,
                    }
                });
                if(checkEmail) throw new BadRequestException('이미 존재하는 이메일입니다.');
            }else if(userDto.id) {
                const checkId = await this.usersRepository.exists({
                    where: {
                        id : userDto.id,
                    }
                });
                if(checkId) throw new BadRequestException('이미 존재하는 아이디입니다.');
            }

            const user = this.usersRepository.create(userDto);
            return await this.usersRepository.save(user);
        }catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 회원 정보 업데이트
     * @param uid 수정 대상 회원 UID
     * @param userDto 수정할 데이터
     * @returns 수정 완료된 UsersEntity
     * @throws 회원이 없으면 NotFoundException
     * @throws DB 저장 오류 시 handleUserDbError 호출
     */
    async updateUser(uid: number, userDto : UpdateUserDto): Promise<UsersEntity>{
        try{
            const user = await this.usersRepository.findOneBy({ uid });
            if (!user) throw new NotFoundException("존재하지 않는 회원의 정보를 수정할 수 없습니다.");

            const merged = this.usersRepository.merge(user, userDto);
            return await this.usersRepository.save(merged);
        }catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 회원 소프트 삭제
     * @param uid 삭제 대상 회원 UID
     * @returns UpdateResult
     * @throws DB 삭제 오류 시 handleUserDbError 호출
     */
    async softDeleteUser(uid: number):Promise<UpdateResult>{
        try{
            const user = await this.usersRepository.findOneBy({ uid });
            if (!user) throw new NotFoundException("존재하지 않는 회원의 정보를 삭제할 수 없습니다.");

            return await this.usersRepository.softDelete({uid});
        }catch (error){
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 회원 하드 삭제
     * @param uid 삭제 대상 회원 UID
     * @returns DeleteResult
     * @throws DB 삭제 오류 시 handleUserDbError 호출
     */
    async hardDeleteUser(uid: number): Promise<DeleteResult>{
        try{
            const user = await this.usersRepository.findOneBy({ uid });
            if (!user) throw new NotFoundException("존재하지 않는 회원의 정보를 삭제할 수 없습니다.");

            return await this.usersRepository.delete({uid});
        }catch (error){
            this.logger.error(error);
            throw error;
        }
    }
}
