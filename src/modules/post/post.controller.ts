import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors
} from '@nestjs/common';
import { PostService } from './post.service';
import {BearerTokenGuard} from "../auth/guard/bearer-token.guard";
import {User} from "../users/decorator/user.decorator";
import {PaginatePostDto} from "./dto/paginate-post.dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import type {MulterFile} from "../../common/type/common.type";
import {MemoryFileUploadConfig} from "../../config/file/memory-file-upload.config";
import {CreatePostDto} from "./dto/create-post.dto";
import type {USER_REQ} from "../auth/type/auth.type";
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@UseGuards(BearerTokenGuard)
@ApiTags('Post - 게시글 관리 & 등록')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
    /**
     * 모든 게시글 조회
     *
     * - GET /post
     * - 모든 게시글 데이터를 조회합니다.
     *
     * @returns 게시글 리스트
     * @example GET /post
     */
    @Get()
    @ApiOperation({ summary: '전체 게시글 조회', description: 'DB에 등록된 모든 게시글을 조회합니다.' })
    @ApiResponse({ status: 200, description: '게시글 목록 반환' })
    @Get()
    getALlPost(){
        return this.postService.getAllPosts();
    }

    /**
     * 게시글 페이지네이션 조회
     *
     * - GET /post/page?page={page}&limit={limit}
     * - 페이지 번호와 페이지 크기를 받아 해당 범위의 게시글 목록을 조회합니다.
     *
     * @param query 페이지네이션 옵션 DTO
     * @returns 게시글 페이지 결과
     */
    @Get('page')
    @ApiOperation({ summary: '게시글 페이지네이션 조회', description: '페이지 및 개수 기반으로 게시글 목록을 반환합니다.' })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
    @ApiQuery({ name: 'limit', required: false, description: '한 페이지당 게시글 개수 (기본값: 10)' })
    @ApiResponse({ status: 200, description: '페이지네이션 게시글 반환' })
    @Get('page')
    getPaginatePost(
        @Query() query: PaginatePostDto
    ){
        return this.postService.paginatePost(query);
    }

    /**
     * 게시글 UID로 단일 조회
     *
     * - GET /post/:uid
     * - 게시글 UID를 통해 특정 게시글 상세 정보를 조회합니다.
     *
     * @param uid 게시글 UID
     * @returns 게시글 상세 정보
     * @example GET /post/1
     */
    @Get(':uid')
    @ApiOperation({ summary: '단일 게시글 조회', description: '게시글 UID를 통해 특정 게시글을 조회합니다.' })
    @ApiParam({ name: 'uid', description: '게시글 UID', example: 1 })
    @ApiResponse({ status: 200, description: '게시글 상세 정보 반환' })
    @Get(':uid')
    getPostById(@Param('uid', ParseIntPipe) uid: number){
      return this.postService.getPostById(uid);
    }

    /**
     * 로그인한 사용자의 게시글 조회
     *
     * - GET /post/owner
     * - 현재 로그인한 사용자가 작성한 게시글만 조회합니다.
     *
     * @param user 로그인한 사용자 정보
     * @returns 사용자가 작성한 게시글 목록
     */
    @Get('owner')
    @UseGuards(BearerTokenGuard)
    @ApiOperation({ summary: '내 게시글 조회', description: 'Bearer 토큰 기반으로 로그인한 사용자의 게시글을 반환합니다.' })
    @ApiResponse({ status: 200, description: '로그인한 사용자의 게시글 반환' })
    @Get('owner')
    @UseGuards(BearerTokenGuard)
    getOwnerPost(
        @User() user: USER_REQ,
    ){
        return this.postService.getOwnerPost(user);
    }

    /**
     * 게시글과 파일 업로드 (디스크 저장 방식)
     *
     * - POST /post/upload/disk
     * - multipart/form-data 형식으로 게시글 데이터와 파일을 업로드합니다.
     *
     * @param post 게시글 생성 DTO
     * @param userReq 현재 로그인한 사용자
     * @param files 업로드할 파일 목록
     * @returns 업로드된 게시글 및 파일 정보
     */
    @Post('upload/disk')
    @UseInterceptors(FilesInterceptor('files'))
    @ApiOperation({ summary: '게시글 + 파일 업로드 (디스크)', description: '게시글 정보와 파일을 디스크에 업로드합니다.' })
    @ApiResponse({ status: 201, description: '게시글 및 파일 업로드 성공' })
    @Post('upload/disk')
    @UseInterceptors(FilesInterceptor('files')) // HTML form의 <input type="file" name="file" /> 에서 name 속성과 일치해야 함
    uploadBFileDiskPost(
        @Body() post: CreatePostDto,
        @User() userReq: USER_REQ,
        @UploadedFiles() files: MulterFile[]
    ){
        return this.postService.uploadBFileDiskPost(post, userReq, files);
    }

    /**
     * 게시글과 파일 업로드 (메모리 저장 방식)
     *
     * - POST /post/upload/memory
     * - multipart/form-data 형식으로 게시글과 파일을 메모리에 저장합니다.
     *
     * @param post 게시글 생성 DTO
     * @param userReq 현재 로그인한 사용자
     * @param files 업로드할 파일 목록
     * @returns 업로드된 게시글 및 파일 정보
     */
    @Post('upload/memory')
    @UseInterceptors(FilesInterceptor('files', Infinity, MemoryFileUploadConfig()))
    @ApiOperation({ summary: '게시글 + 파일 업로드 (메모리)', description: '게시글 정보와 파일을 메모리에 업로드합니다.' })
    @ApiResponse({ status: 201, description: '게시글 및 파일 업로드 성공' })
    @Post('upload/memory')
    @UseInterceptors(FilesInterceptor('files', Infinity, MemoryFileUploadConfig())) // HTML form의 <input type="file" name="file" /> 에서 name 속성과 일치해야 함
    uploadFileMemoryPost(
        @Body() post: CreatePostDto,
        @User() userReq: USER_REQ,
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
