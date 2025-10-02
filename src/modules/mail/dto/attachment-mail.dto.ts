import {CommonSendMailDto} from "./common-send-mail.dto";
import {IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import type { Attachment } from 'nodemailer/lib/mailer';

export class AttachmentMailDto extends CommonSendMailDto{
    /** 첨부파일 필수 */
    @IsNotEmpty()
    @ValidateNested({ each: true })
    attachments!: Attachment[];

    /** 텍스트 또는 HTML 본문 중 최소 하나 필요 */
    @IsOptional()
    text?: string;

    @IsOptional()
    html?: string;
}