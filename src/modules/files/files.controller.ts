import {Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor} from "@nestjs/platform-express";
import {BearerTokenGuard} from "../auth/guard/bearer-token.guard";
import {User} from "../users/decorator/user.decorator";
import {MemoryFileUploadConfig} from "../../config/file/memory-file-upload.config";
import type {MulterFile} from "../../common/type/common.type";
import {ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import type {USER_REQ} from "../auth/type/auth.type";

@UseGuards(BearerTokenGuard)
@ApiTags('Files - 파일 관리 및 등록(파일 선 등록 패턴으로 활용도 가능)')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    /**
     * 파일 URL 조회
     *
     * - GET /files?file={fileUuid}
     * - 쿼리 파라미터로 파일 UUID 전달
     * - 파일 저장소에서 파일 접근 URL 반환
     *
     * @param fileUuid 조회할 파일 UUID
     * @returns 파일 접근 URL
     *
     * @example
     * GET /files?file=123e4567-e89b-12d3-a456-426614174000
     * Response: { "url": "https://cdn.example.com/123e4567-e89b-12d3-a456-426614174000.jpg" }
     */
    @ApiOperation({ summary: '파일 URL 조회', description: '파일 UUID로 저장된 파일의 접근 URL을 반환합니다.' })
    @ApiQuery({ name: 'file', required: true, description: '조회할 파일 UUID' })
    @ApiResponse({ status: 200, description: '파일 접근 URL 반환', schema: { example: { url: 'http://localhost:3000/...' } } })
    @Get()
    getFileUrl(
        @Query('file') fileUuid: string
    ){
        return this.filesService.getFileUrl(fileUuid);
    }

    /**
     * 파일 업로드 (디스크 저장후 DB 입력)
     *
     * - POST /files/upload/disk
     * - multipart/form-data 형식으로 파일 업로드
     * - HTML form: <input type="file" name="files" multiple />
     *
     * @param files 업로드할 파일들
     * @param user 현재 로그인 사용자 정보
     * @returns 업로드된 파일 UUID 리스트
     *
     * @example
     * POST /files/upload/disk
     * FormData: files=[file1.jpg, file2.png]
     * Response: { "files": ["uuid1", "uuid2"] }
     */
    @ApiOperation({ summary: '파일 업로드 (디스크 저장후 DB 입력)', description: '업로드된 파일을 서버 디스크에 저장하고 DB애 정보 입력' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: '업로드 성공', schema: { example: { files: ['uuid1', 'uuid2'] } } })
    // 중요! @UseInterceptors(FileInterceptor('file')) // HTML form의 <input type="file" name="file" /> 에서 name 속성과 일치해야 함
    @Post('upload/disk')
    @UseInterceptors(FilesInterceptor('files'))
    uploadBFileDisk(
        @UploadedFiles() files: MulterFile[],
        @User() user: USER_REQ
    ){
        return this.filesService.uploadBFileDisk(files, user);
    }

    /**
     * 파일 업로드 (메모리 저장한 다음 디스크에 저장 후 DB 입력)
     *
     * - POST /files/upload/memory
     * - multipart/form-data 형식으로 파일 업로드
     * - 서버 메모리에 파일 임시 저장 후 처리
     *
     * @param files 업로드할 파일들
     * @param user 현재 로그인 사용자 정보
     * @returns 업로드된 파일 UUID 리스트
     *
     * @example
     * POST /files/upload/memory
     * FormData: files=[file1.jpg, file2.png]
     * Response: { "files": ["uuid1", "uuid2"] }
     */
    @ApiOperation({ summary: '파일 업로드 (메모리 저장한 다음 디스크에 저장 후 DB 입력)', description: '업로드된 파일을 서버 메모리에 임시 저장 후 디스크에 저장하고 DB에 정보 입력' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: '업로드 성공'})
    @Post('upload/memory')
    @UseInterceptors(FilesInterceptor('files', Infinity, MemoryFileUploadConfig()))
    uploadFileMemory(
        @UploadedFiles() files: MulterFile[],
        @User() user: USER_REQ
    ){
        return this.filesService.uploadFileMemory('files', files, user);
    }
}
