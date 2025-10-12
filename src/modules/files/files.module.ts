import {Module} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FilesEntity} from "./entities/files.entity";
import {MulterModule} from "@nestjs/platform-express";
import {DiskFileUploadConfig} from "../../config/file/disk-file-upload.config";
import {UsersModule} from "../users/users.module";
import {UsersEntity} from "../users/entities/users.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FilesEntity,
            UsersEntity,
        ]),
        MulterModule.registerAsync(DiskFileUploadConfig('files')),
        UsersModule,
    ],
    exports: [FilesService],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}
