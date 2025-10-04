import { ApiProperty } from '@nestjs/swagger';

export class MailResponseSwaggerDto {
    @ApiProperty({ type: [String], description: '메일 전송이 성공한 수신자 목록' })
    accepted: string[];

    @ApiProperty({ type: [String], description: '메일 전송이 실패한 수신자 목록' })
    rejected: string[];

    @ApiProperty({ description: '메일 전송 ID', example: 'abcdef123456' })
    messageId: string;
}