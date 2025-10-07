import {IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class LoginAuthDto {
    @IsString()
    @MinLength(3, { message: 'ID는 최소 3자리 이상이어야 합니다.' })
    @MaxLength(20, { message: 'ID는 최대 20자리 이하이어야 합니다.' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'ID는 알파벳, 숫자, _만 허용됩니다.' })
    @IsOptional()
    id?: string;

    @IsOptional()
    @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다.' })
    email?: string;

    @IsString()
    password: string;
}