import {BaseEntity} from "../../../common/entities/base.entity";
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import {RoleEntity} from "../../role/entities/role.entity";

@Entity('groups')
export class GroupEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        comment: '그룹 고유 식별자 (자동 증가 PK)',
    })
    uid: number;

    @Column({
        unique: true,
        comment: '그룹 이름 (중복 불가)',
    })
    name: string;

    @Column({
        nullable: true,
        comment: '그룹 설명',
    })
    description: string;

    @ManyToMany(_ => UsersEntity, (users) => users.group)
    users: UsersEntity[]

    @ManyToMany(() => RoleEntity)
    @JoinTable()
    roles: RoleEntity[];  // 그룹 단위 역할
}