import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

class TextMailSwaggerDto {
    @ApiProperty({ example: 'no-reply@example.com', description: '발신자 이메일' })
    from: string;

    @ApiProperty({ example: 'user@example.com', description: '수신자 이메일' })
    to: string;

    @ApiProperty({ example: '메일 제목', description: '메일 제목' })
    subject: string;

    @ApiProperty({ example: '메일 본문', description: '메일 본문 내용' })
    text: string;
}

class TemplateMailSwaggerDto {
    @ApiProperty({ example: 'no-reply@example.com', description: '발신자 이메일' })
    from: string;

    @ApiProperty({ example: 'user@example.com', description: '수신자 이메일' })
    to: string;

    @ApiProperty({ example: '메일 제목', description: '메일 제목' })
    subject: string;

    @ApiProperty({ example: 'auth', description: '템플릿 이름' })
    template: string;

    @ApiProperty({ example: { name: '사용자' }, description: '템플릿에 들어갈 데이터' })
    context: object;
}

class AttachmentMailSwaggerDto {
    @ApiProperty({ example: 'no-reply@example.com', description: '발신자 이메일' })
    from: string;

    @ApiProperty({ example: 'user@example.com', description: '수신자 이메일' })
    to: string;

    @ApiProperty({ example: '메일 제목', description: '메일 제목' })
    subject: string;

    @ApiProperty({ example: '메일 본문', description: '메일 본문 내용' })
    text: string;

    @ApiProperty({ description: '첨부파일', type: 'string', format: 'binary' })
    attachments: any[];
}

@ApiExtraModels(TextMailSwaggerDto, TemplateMailSwaggerDto, AttachmentMailSwaggerDto)
export class SendMailSwaggerDto {
    @ApiProperty({
        description: '메일 전송 데이터 (Text, Template, Attachment 중 하나)',
        oneOf: [
            { $ref: getSchemaPath(TextMailSwaggerDto) },
            { $ref: getSchemaPath(TemplateMailSwaggerDto) },
            { $ref: getSchemaPath(AttachmentMailSwaggerDto) },
        ],
    })
    data: TextMailSwaggerDto | TemplateMailSwaggerDto | AttachmentMailSwaggerDto;
}
