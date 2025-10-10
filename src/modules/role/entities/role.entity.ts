import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import {PermissionEntity} from "../../permission/entities/permission.entity";
import UserRoleEnum from "../../../common/constants/user.constant";

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn({
        comment: '역할 고유 식별자 (자동 증가 PK)',
    })
    uid: number;

    @Column({
        type: 'enum',
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.USER,
        comment: '역할 이름 (예: ADMIN, MANAGER, USER, GUEST)',
    })
    name: UserRoleEnum;

    @Column({
        nullable: true,
        comment: '역할 설명',
    })
    description: string;

    @ManyToMany(_ => UsersEntity, users => users.roles)
    users: UsersEntity[];

    @ManyToMany(() => PermissionEntity, permission => permission.roles, { cascade: true })
    @JoinTable()
    permissions: PermissionEntity[];
}