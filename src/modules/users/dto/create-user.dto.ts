import {RoleEntity} from "../../role/entities/role.entity";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    @IsString({ message: '아이디는 문자열이어야 합니다.' })
    id: string;

    @ApiPropertyOptional({ example: '닉네임', description: '사용자 닉네임' })
    @IsOptional()
    @IsString({ message: '닉네임은 문자열이어야 합니다.' })
    nickname?: string;

    @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
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
    @IsBoolean({ message: 'isActive는 boolean 값이어야 합니다.' })
    isActive: boolean = true;

    @ApiProperty({ type: [RoleEntity], description: '사용자 역할 목록' })
    @IsArray({ message: 'roles는 배열이어야 합니다.' })
    roles: RoleEntity[];
}
