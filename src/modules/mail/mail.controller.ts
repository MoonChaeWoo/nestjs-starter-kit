import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {MailService} from './mail.service';
import type {MailResponseType, SendMailType} from "./types/mail-types.type";

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Get()
    getSendEmail(
        @Query() sendMailDto: SendMailType
    ): Promise<MailResponseType> {
        return this.mailService.sendEmail(sendMailDto);
    }

    @Post()
    postSendEmail(
        @Body() sendMailDto: SendMailType
    ): Promise<MailResponseType> {
        return this.mailService.sendEmail(sendMailDto);
    }
}