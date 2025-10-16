import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {USER_REQ} from "../../auth/type/auth.type";

export const User = createParamDecorator((
    data : keyof USER_REQ | undefined, context : ExecutionContext
) => {
    const request = context.switchToHttp().getRequest();

    if(data){
        return request?.[data]
    }
    const {id, email, uid} = request;

    return {id, email, uid};
});