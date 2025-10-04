import {
    Column,
    Entity, JoinTable, ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    VersionColumn
} from "typeorm";
import UserRoleEnum from "../../../common/constants/user.const";
import {PostEntity} from "../../post/entities/post.entity";
import {BaseEntity} from "../../../common/entities/base.entity";
import {FilesEntity} from "../../files/entities/files.entity";
import {GroupEntity} from "../../group/entities/group.entity";
import {RoleEntity} from "../../role/entities/role.entity";
import RolesEnum from "../../../common/constants/roles.const";

@Entity('users')
export class UsersEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    uid: number;

    @ManyToMany(_ => GroupEntity, (group) => group.users)
    group: GroupEntity[];

    @Column({
        unique : true,
        length : 20,
    })
    id: string;

    @Column({
        unique : true,
        length : 20,
    })
    nickname: string;

    @Column({
        unique : true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.USER,
    })
    userType: UserRoleEnum;

    @Column({ default: true })
    isActive?: boolean;

    @VersionColumn()
    version: number;

    @OneToMany(_ => PostEntity, posts => posts.author, { cascade: ['insert', 'update'] })
    posts: PostEntity[];

    @OneToMany(_ => FilesEntity, files => files.uploadedBy, { cascade: true })
    files: FilesEntity[];

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable()
    roles: RoleEntity[];

    get effectiveRoles(): RolesEnum[] {
        if (this.roles && this.roles.length) {
            return this.roles.map(r => r.name);
        }
        // roles 비어있으면 userType 기준 기본 역할 반환
        switch(this.userType) {
            case UserRoleEnum.ADMIN: return [RolesEnum.SUPER_ADMIN];
            case UserRoleEnum.USER: return [RolesEnum.CONTENT_EDITOR, RolesEnum.VIEWER];
            case UserRoleEnum.GUEST: return [RolesEnum.VIEWER];
        }
    }
}
