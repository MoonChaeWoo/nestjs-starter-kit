import {IsNumber, IsObject, IsOptional, IsString, ValidateIf} from "class-validator";

export class MessageEventDto {
    @ValidateIf(o => typeof o.data === 'string')
    @IsString()
    @ValidateIf(o => typeof o.data === 'object')
    @IsObject()
    data: string | object;

    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsNumber()
    retry?: number;

    @IsOptional()
    @IsNumber()
    timestamp?: number = new Date().getTime();
}