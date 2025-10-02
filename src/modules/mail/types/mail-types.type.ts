import {TextMailDto} from "../dto/text-mail.dto";
import {TemplateMailDto} from "../dto/template-mail.dto";
import {AttachmentMailDto} from "../dto/attachment-mail.dto";
import type { SentMessageInfo } from 'nodemailer';

// 메일 전송 시 - 텍스트타입 / 템플릿(ejs)타입 / 첨부파일 타입
export type SendMailType = TextMailDto | TemplateMailDto | AttachmentMailDto;

// 메일 전송 후 결과 응답 타입
export type MailResponseType = Pick<SentMessageInfo, 'accepted' | 'rejected' | 'messageId'>;