import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity';
import PermissionEnum from "../../../common/constants/permission.const";

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    uid: number;

    @Column({
        type: 'enum',
        enum: Object.values(PermissionEnum),
        default: PermissionEnum.READ_USER,
    })
    name: PermissionEnum;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];
}