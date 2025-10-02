import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import RolesEnum from "../../../common/constants/roles.const";
import {PermissionEntity} from "../../permission/entities/permission.entity";

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    uid: number;

    @Column({
        type: 'enum',
        enum: Object.values(RolesEnum),
        default: RolesEnum.CONTENT_EDITOR
    })
    name: RolesEnum;

    @Column({nullable: true})
    description: string;

    @ManyToMany(_ => UsersEntity, users => users.roles)
    users: UsersEntity[];

    @ManyToMany(() => PermissionEntity, permission => permission.roles, { cascade: true })
    @JoinTable()
    permissions: PermissionEntity[];
}