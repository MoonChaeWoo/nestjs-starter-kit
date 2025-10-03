import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../users/entities/users.entity";
import {RoleEntity} from "./entities/role.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity]),
    ],
    exports: [RoleService],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule {}
