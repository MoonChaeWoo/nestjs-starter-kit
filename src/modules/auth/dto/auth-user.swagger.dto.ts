import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class AuthUserSwaggerDto {
    @ApiPropertyOptional({
        description: '사용자 이메일 (선택)',
        example: 'user@example.com',
    })
    email?: string;

    @ApiPropertyOptional({
        description: '사용자 아이디 (선택)',
        example: 'user01',
    })
    id?: string;

    @ApiProperty({
        description: '사용자 비밀번호',
        example: 'password123',
    })
    password: string;
}