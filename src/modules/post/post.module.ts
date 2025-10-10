import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./entities/post.entity";
import {UsersModule} from "../users/users.module";
import {UsersEntity} from "../users/entities/users.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                PostEntity,
                UsersEntity
            ]
        ),
        UsersModule,
        AuthModule,
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
