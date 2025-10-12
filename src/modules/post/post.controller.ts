import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors
} from '@nestjs/common';
import { PostService } from './post.service';
import {BearerTokenGuard} from "../auth/guard/bearer-token.guard";
import {User} from "../users/decorator/user.decorator";
import {UsersEntity} from "../users/entities/users.entity";
import {PaginatePostDto} from "./dto/paginate-post.dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import type {MulterFile} from "../../common/type/common.type";
import {MemoryFileUploadConfig} from "../../config/file/memory-file-upload.config";
import {CreatePostDto} from "./dto/create-post.dto";

@UseGuards(BearerTokenGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
    @Get()
    getALlPost(){
        return this.postService.getAllPosts();
    }

    @Get('page')
    getPaginatePost(
        @Query() query: PaginatePostDto
    ){
        return this.postService.paginatePost(query);
    }

    @Get(':uid')
    getPostById(@Param('uid', ParseIntPipe) uid: number){
      return this.postService.getPostById(uid);
    }

    @Get('owner')
    @UseGuards(BearerTokenGuard)
    getOwnerPost(
        @User() user: Pick<UsersEntity, 'email' | 'id'>,
    ){
        return this.postService.getOwnerPost(user);
    }

    @Post('upload/disk')
    @UseInterceptors(FilesInterceptor('files')) // HTML form의 <input type="file" name="file" /> 에서 name 속성과 일치해야 함
    uploadBFileDiskPost(
        @Body() post: CreatePostDto,
        @User() userReq: Pick<UsersEntity, 'email' | 'id'>,
        @UploadedFiles() files: MulterFile[]
    ){
        return this.postService.uploadBFileDiskPost(post, userReq, files);
    }

    @Post('upload/memory')
    @UseInterceptors(FilesInterceptor('files', Infinity, MemoryFileUploadConfig())) // HTML form의 <input type="file" name="file" /> 에서 name 속성과 일치해야 함
    uploadFileMemoryPost(
        @Body() post: CreatePostDto,
        @User() userReq: Pick<UsersEntity, 'email' | 'id'>,
        @UploadedFiles() files: MulterFile[]
    ){
        return this.postService.uploadFileMemoryPost(post, userReq, files);
    }

    @Patch('update/:uid')
    updatePost(
        @Param('uid', ParseIntPipe) uid: number
    ){
        return this.postService.updatePost();
    }

    @Delete('delete/:uid')
    deletePost(
        @Param('uid', ParseIntPipe) uid: number
    ){
        return this.postService.deletePost();
    }

    @Delete('delete/hard/:uid')
    deleteHardPost(
        @Param('uid', ParseIntPipe) uid: number
    ){
        return this.postService.deleteHardPost();
    }


}
