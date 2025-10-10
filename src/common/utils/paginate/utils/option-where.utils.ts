import {FilterMapper} from "../constants/filter-mapper.constant";
import {FindOptionsWhere} from "typeorm";

export const optionWhere = <T>(condition) : FindOptionsWhere<T> => {
    const where_condition = Object.entries(condition).filter(arr =>
        arr[0].includes('where__') && arr[1]
    );

    return where_condition.reduce((arr, curr) => {
        const [_, key, condition] = curr[0].split('__');
        const values = typeof curr[1] === 'string' ? curr[1].split(',') : curr[1];

        if(Array.isArray(values)){
            return {...arr, ...(condition ? {[key] : FilterMapper[condition](...values)} : {[key] : values[0]})};
        }else{
            return {...arr, ...(condition ? {[key] : FilterMapper[condition](values)} : {[key] : values})};
        }
    }, {} as FindOptionsWhere<T>);
};