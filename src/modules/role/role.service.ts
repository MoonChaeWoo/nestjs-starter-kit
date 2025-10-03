import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./entities/role.entity";
import {In, Not, Repository} from "typeorm";
import RolesEnum from "../../common/constants/roles.const";

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>
    ){}

    async grantRolesToUser(role: RolesEnum): Promise<RoleEntity[]>{
        try{
            switch(role){
                case RolesEnum.SUPER_ADMIN:
                    return await this.grantSuperUser();
                case RolesEnum.MANAGER:
                    return await this.grantManager();
                case RolesEnum.CONTENT_EDITOR:
                    return await this.grantContentEditor();
                case RolesEnum.VIEWER:
                    return await this.grantViewer();
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
            where: { name: Not(In(['SUPER_ADMIN'])) }
        });
    }

    async grantContentEditor(){
        return this.roleRepository.find({
            where: { name: Not(In(['SUPER_ADMIN', 'MANAGER'])) }
        });
    }

    async grantViewer(){
        return this.roleRepository.find({
            where: { name: Not(In(['VIEWER'])) }
        });
    }
}
