import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import type {MailResponseType, SendMailType} from "./types/mail-types.type";
import {handleMailError} from "./constants/mail.constants";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(sendMailDto: SendMailType): Promise<MailResponseType> {
        try {
            const result = await this.mailerService.sendMail(sendMailDto);
            return {
                accepted: result.accepted,
                rejected: result.rejected,
                messageId: result.messageId,
            };
        } catch (error: any) {
            console.error('메일 발송 실패:', error);
            throw handleMailError(error.responseCode);
        }
    }
}
