import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, IsUUID} from "class-validator";

export class CreateFileDto {
    @ApiProperty({ example: 'original_file.jpg', description: '원본 파일 이름' })
    @IsString({ message: 'originalName은 문자열이어야 합니다.' })
    originalName: string;

    @ApiProperty({ example: 'stored_file_123.jpg', description: '서버에 저장된 파일 이름' })
    @IsString({ message: 'storedName은 문자열이어야 합니다.' })
    storedName: string;

    @ApiProperty({ example: '/uploads/2025/10/', description: '파일 저장 경로' })
    @IsString({ message: 'path는 문자열이어야 합니다.' })
    path: string;

    @ApiProperty({ example: 'jpg', description: '파일 확장자' })
    @IsString({ message: 'extension은 문자열이어야 합니다.' })
    extension: string;

    @ApiProperty({ example: 102400, description: '파일 크기 (바이트)' })
    @IsNumber({}, { message: 'size는 숫자여야 합니다.' })
    size: number;

    @ApiProperty({ example: 'image/jpeg', description: '파일 MIME 타입' })
    @IsString({ message: 'mimeType은 문자열이어야 합니다.' })
    mimeType: string;

    @ApiPropertyOptional({ example: 'post-uuid', description: '연관 게시글 UUID (선택)' })
    @IsOptional()
    @IsUUID(undefined, { message: 'post는 UUID 형식이어야 합니다.' })
    post?: string;

    @ApiProperty({ example: 'user-uuid', description: '업로더 UUID' })
    @IsUUID(undefined, { message: 'uploadedBy는 UUID 형식이어야 합니다.' })
    uploadedBy: string;
}
