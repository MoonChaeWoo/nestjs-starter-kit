import {UsersEntity} from "../../users/entities/users.entity";

export type USER_REQ = Pick<UsersEntity, 'email' | 'id' | 'uid'>