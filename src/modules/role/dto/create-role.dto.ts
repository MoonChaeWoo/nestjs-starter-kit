import UserRoleEnum from "../../../common/constants/user.const";

export class CreateRoleDto {
    name: UserRoleEnum;
    description: string;
}
