import {BaseEntity} from "../../../common/entities/base.entity";
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import {RoleEntity} from "../../role/entities/role.entity";

@Entity('groups')
export class GroupEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    uid: number;

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    description: string;

    @ManyToMany(_ => UsersEntity, (users) => users.group)
    users: UsersEntity[]

    @ManyToMany(() => RoleEntity)
    @JoinTable()
    roles: RoleEntity[];  // 그룹 단위 역할
}