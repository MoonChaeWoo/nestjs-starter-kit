import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {UsersEntity} from "../entities/users.entity";

export const User = createParamDecorator((
    data : keyof Pick<UsersEntity, 'id' | 'email'> | undefined, context : ExecutionContext
) => {
    const request = context.switchToHttp().getRequest();

    if(data){
        return request?.[data]
    }
    const {id, email} = request;

    return {id, email};
});