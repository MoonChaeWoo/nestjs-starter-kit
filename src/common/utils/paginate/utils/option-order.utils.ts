import {FindOptionsOrder} from "typeorm";

export const optionOrder = <T>(condition) : FindOptionsOrder<T> => {
    const order_condition = Object.entries(condition).filter(arr =>
        arr[0].includes('order__') && arr[1]
    );

    return order_condition.reduce((acc, curr) => {
        const key = curr[0].split('__')[1];
        const value = curr[1] as string;

        return {...acc, [key] : value.toUpperCase()};
    }, {} as FindOptionsOrder<T>);
};