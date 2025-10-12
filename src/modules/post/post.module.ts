import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./entities/post.entity";
import {UsersModule} from "../users/users.module";
import {UsersEntity} from "../users/entities/users.entity";
import {AuthModule} from "../auth/auth.module";
import {MulterModule} from "@nestjs/platform-express";
import {DiskFileUploadConfig} from "../../config/file/disk-file-upload.config";
import {FilesModule} from "../files/files.module";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                PostEntity,
                UsersEntity
            ]
        ),
        MulterModule.registerAsync(DiskFileUploadConfig('post')),
        UsersModule,
        AuthModule,
        FilesModule,
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
