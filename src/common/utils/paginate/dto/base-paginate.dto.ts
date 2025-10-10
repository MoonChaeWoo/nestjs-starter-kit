import {IsIn, IsNumber, IsOptional, IsString} from "class-validator";

export class BasePaginateDto {
    @IsNumber()
    @IsOptional()
    where__uid__more_than?: number;

    @IsNumber()
    @IsOptional()
    where__uid__less_than?: number;

    @IsIn(['ASC', 'DESC', 'asc', 'desc'])
    @IsOptional()
    order__createdAt?: 'ASC' | 'DESC' | 'asc' | 'desc';

    @IsString()
    @IsOptional()
    where__between__createdAt?: string;

    @IsIn(['ASC', 'DESC', 'asc', 'desc'])
    @IsOptional()
    order__updatedAt?: 'ASC' | 'DESC' | 'asc' | 'desc';

    @IsString()
    @IsOptional()
    where__between__updatedAt?: string;

    @IsIn(['ASC', 'DESC', 'asc', 'desc'])
    @IsOptional()
    order__deletedAt?: 'ASC' | 'DESC' | 'asc' | 'desc';

    @IsString()
    @IsOptional()
    where__between__deletedAt?: string;

    @IsNumber()
    @IsOptional()
    take?: number = 10;
}