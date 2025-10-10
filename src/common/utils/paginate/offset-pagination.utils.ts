import {FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository} from "typeorm";
import {BasePaginateDto} from "./dto/base-paginate.dto";

const OffsetPagination = <T extends ObjectLiteral>(
    repository: Repository<T>,
    option: BasePaginateDto
) => {



    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    return {
        skip: '',
        take: '',
        order : {}

    }
}