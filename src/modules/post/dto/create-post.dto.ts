import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {FilesEntity} from "../../files/entities/files.entity";
import {UsersEntity} from "../../users/entities/users.entity";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: '게시글 제목은 필수입니다.' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: '게시글 내용은 필수입니다.' })
    content: string;

    @IsOptional()
    files?: FilesEntity[] | string[] = [];

    @IsOptional()
    author?: UsersEntity | number;
}
