import UserRoleEnum from "../../../common/constants/user.constant";

export class CreateRoleDto {
    name: UserRoleEnum;
    description: string;
}
