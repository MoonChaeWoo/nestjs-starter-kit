import {CommonSendMailDto} from "./common-send-mail.dto";
import {IsNotEmpty, IsString} from "class-validator";

export class TemplateMailDto extends CommonSendMailDto{
    /** 템플릿 파일 이름 필수 */
    @IsNotEmpty()
    @IsString()
    template!: string;

    /** 템플릿 렌더링 변수 필수 */
    @IsNotEmpty()
    context!: { [name: string]: any };
}