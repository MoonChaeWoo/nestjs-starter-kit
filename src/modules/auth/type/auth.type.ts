import {UsersEntity} from "../../users/entities/users.entity";

export type AuthUserType = Pick<UsersEntity, 'email' | 'id' | 'password'>;