import {BadRequestException, Injectable, Logger } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./entities/role.entity";
import {In, Not, Repository} from "typeorm";
import UserRoleEnum from "../../common/constants/user.constant";

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>
    ){}

    async grantRolesToUser(userType: UserRoleEnum): Promise<RoleEntity[]>{
        if(!userType) throw new BadRequestException('유저의 타입을 지정해주세요.');
        try{
            switch(userType){
                case UserRoleEnum.ADMIN:
                    return await this.grantSuperUser();
                case UserRoleEnum.MANAGER:
                    return await this.grantManager();
                case UserRoleEnum.USER:
                    return await this.grantUser();
                case UserRoleEnum.GUEST:
                    return await this.grantGuest();
                default:
                    throw new BadRequestException('잘못된 역할 요청을 하였습니다.');
            }
        }catch(error){
            this.logger.error('잘못된 역할 요청 : ', error.message);
            throw error;
        }
    }

    async grantSuperUser(){
        return this.roleRepository.find();
    }

    async grantManager(){
        return this.roleRepository.find({
            where: { name: Not(In(['ADMIN'])) }
        });
    }

    async grantUser(){
        return this.roleRepository.find({
            where: { name: Not(In(['ADMIN', 'MANAGER'])) }
        });
    }

    async grantGuest(){
        return this.roleRepository.find({
            where: { name: Not(In(['ADMIN', 'MANAGER', 'USER'])) }
        });
    }
}
