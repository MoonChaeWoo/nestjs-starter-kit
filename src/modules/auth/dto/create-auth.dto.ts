import RolesEnum from "../../../common/constants/roles.const";

export class CreateAuthDto {
    id: string;
    nickname?: string;
    email: string;
    password: string;
    role: RolesEnum;
}
