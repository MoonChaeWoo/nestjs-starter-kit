import {BasePaginateDto} from "../../../common/utils/paginate/dto/base-paginate.dto";
import {IsIn, IsNumber, IsOptional, IsString} from "class-validator";

export class PaginatePostDto extends BasePaginateDto{
    @IsNumber()
    @IsOptional()
    where__like_count__more_than?: number;

    @IsNumber()
    @IsOptional()
    where__like_count__less_than?: number;

    @IsIn(['ASC', 'DESC', 'asc', 'desc'])
    @IsOptional()
    order__title?: 'ASC' | 'DESC' | 'asc' | 'desc';

    @IsString()
    @IsOptional()
    where__title__like?: string;

    @IsString()
    @IsOptional()
    where__title__ilike?: string;

    @IsString()
    @IsOptional()
    where__content__like?: string;

    @IsString()
    @IsOptional()
    where__content__ilike?: string;
}