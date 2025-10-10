import {FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository} from "typeorm";
import {BasePaginateDto} from "./dto/base-paginate.dto";
import {optionWhere} from "./utils/option-where.utils";
import {optionOrder} from "./utils/option-order.utils";

export const ScrollPagination =  async <T extends ObjectLiteral>(
    repository: Repository<T>,
    option: BasePaginateDto,
    endpoint: string
) => {
    const where: FindOptionsWhere<T> = optionWhere<T>(option);
    const order: FindOptionsOrder<T> = optionOrder<T>(option);

    const [target, count] =  await repository.findAndCount({
        where,
        order,
        take: option.take,
    });

    const lastItem = target.findLast(Boolean);
    const params = Object.fromEntries(Object.entries(option).filter(arr => arr[1]));
    const search = new URLSearchParams(params);
    const key = Object.keys(params).find(param => param.includes('more'));

    if(lastItem){
        search.set(key!, lastItem[key!.split('__')[1]])
    }

    return {
        data : target,
        cursor : {
            after : lastItem?.uid,
        },
        count : target?.length,
        totalCount : count,
        next : lastItem ? `${endpoint}?${search.toString()}` : null,
    }
};