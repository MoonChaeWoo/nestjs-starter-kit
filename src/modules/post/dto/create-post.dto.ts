import { IsNotEmpty, IsString} from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: '게시글 제목은 필수입니다.' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: '게시글 내용은 필수입니다.' })
    content: string;
}
