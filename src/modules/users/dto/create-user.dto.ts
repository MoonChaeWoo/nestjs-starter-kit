import {RoleEntity} from "../../role/entities/role.entity";

export class CreateUserDto {
    id: string;
    nickname?: string;
    email: string;
    password: string;
    roles : RoleEntity[];
}
