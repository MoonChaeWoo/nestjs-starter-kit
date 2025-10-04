import RolesEnum from "../../../common/constants/roles.const";
import {IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty({
        example: 'user123',
        description: '회원 계정 ID. 3~20자, 알파벳/숫자/_ 사용 가능'
    })
    @IsString()
    @MinLength(3, { message: 'ID는 최소 3자리 이상이어야 합니다.' })
    @MaxLength(20, { message: 'ID는 최대 20자리 이하이어야 합니다.' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'ID는 알파벳, 숫자, _만 허용됩니다.' })
    id: string;

    @ApiPropertyOptional({
        example: 'Tester',
        description: '회원 닉네임 (선택사항)'
    })
    @IsOptional()
    @IsString()
    @MinLength(2, {message: '닉네임은 최소 2자리 이상이어야 합니다.'})
    @MaxLength(30, {message: '닉네임은 최대 30자리 이하이어야 합니다.'})
    nickname?: string;

    @ApiProperty({
        example: 'user@example.com',
        description: '회원 이메일'
    })
    @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다.' })
    email: string;

    @IsString()
    @MinLength(9, { message: '비밀번호는 최소 9자리 이상이어야 합니다.' })
    @MaxLength(64, { message: '비밀번호는 최대 64자리 이하이어야 합니다.' })
    @Matches(/(?=.*[a-z])/, { message: '비밀번호에는 소문자가 최소 1개 이상 포함되어야 합니다.' })
    @Matches(/(?=.*[A-Z])/, { message: '비밀번호에는 대문자가 최소 1개 이상 포함되어야 합니다.' })
    @Matches(/(?=.*\d)/, { message: '비밀번호에는 숫자가 최소 1개 이상 포함되어야 합니다.' })
    @Matches(/(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: '비밀번호에는 특수문자가 최소 1개 이상 포함되어야 합니다.' })
    password: string;

    @ApiPropertyOptional({ description: '회원 활성 상태', default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        enum: RolesEnum,
        description: '회원 역할'
    })
    @IsEnum(RolesEnum, { message: '유효한 역할이어야 합니다.' })
    role: RolesEnum;
}
