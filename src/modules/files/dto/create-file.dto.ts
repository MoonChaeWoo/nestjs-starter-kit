import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested} from "class-validator";
import {UsersEntity} from "../../users/entities/users.entity";
import {PostEntity} from "../../post/entities/post.entity";

export class CreateFileDto {
    @ApiProperty({ example: 'original_file.jpg', description: '원본 파일 이름' })
    @IsString({ message: 'originalName은 문자열이어야 합니다.' })
    originalName: string;

    @ApiProperty({ example: 'stored_file_123.jpg', description: '서버에 저장된 파일 이름' })
    @IsString({ message: 'storedName은 문자열이어야 합니다.' })
    storedName: string;

    @ApiProperty({ example: '/Desktop/portfolio/backend/nestjs-starter-kit/uploads/2025/10/', description: '파일 저장 경로' })
    @IsString({ message: 'path는 문자열이어야 합니다.' })
    path: string;

    @ApiProperty({ example: '/uploads/2025/10/', description: '파일 저장 경로' })
    @IsString({ message: 'path는 문자열이어야 합니다.' })
    url: string;

    @ApiProperty({ example: 'jpg', description: '파일 확장자' })
    @IsString({ message: 'extension은 문자열이어야 합니다.' })
    extension: string;

    @ApiProperty({ example: 102400, description: '파일 크기 (바이트)' })
    @IsNumber({}, { message: 'size는 숫자여야 합니다.' })
    size: number;

    @ApiProperty({ example: '/upload/file.webp', description: '썸네일 파일 저장' })
    @IsString({ message: 'thumbnail은 문자열이어야 합니다.' })
    thumbnail?: string;

    @ApiProperty({ example: 'image/jpeg', description: '파일 MIME 타입' })
    @IsString({ message: 'mimeType은 문자열이어야 합니다.' })
    mimetype: string;

    @ApiProperty({ type: PostEntity, description: '게시글 엔티티' })
    @ValidateNested()
    post?: PostEntity;

    @ApiProperty({ type: UsersEntity, description: '사용자 엔티티' })
    @ValidateNested()
    uploadedBy: UsersEntity;
}
