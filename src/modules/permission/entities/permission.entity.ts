import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity';
import PermissionEnum from "../../../common/constants/permission.const";

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        comment: '권한 고유 식별자 (자동 증가 PK)',
    })
    uid: number;

    @Column({
        type: 'enum',
        enum: Object.values(PermissionEnum),
        default: PermissionEnum.READ_USER,
        comment: '권한 이름 (ENUM 값, 예: READ_USER, WRITE_USER 등)',
    })
    name: PermissionEnum;

    @Column({
        nullable: true,
        comment: '권한에 대한 설명',
    })
    description: string;

    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];
}