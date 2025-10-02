import {CommonSendMailDto} from "./common-send-mail.dto";
import {IsNotEmpty} from "class-validator";

export class TextMailDto extends CommonSendMailDto{
    /** 텍스트 본문 필수 */
    @IsNotEmpty()
    text!: string;
}