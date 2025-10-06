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

@Entity('users')
export class UsersEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        comment: '사용자 고유 식별자 (자동 증가 PK)',
    })
    uid: number;

    @ManyToMany(_ => GroupEntity, (group) => group.users)
    group: GroupEntity[];

    @Column({
        unique : true,
        length : 20,
        comment: '로그인용 사용자 ID (중복 불가)'
    })
    id: string;

    @Column({
        unique : true,
        length : 20,
        comment: '사용자 닉네임 (중복 불가)'
    })
    nickname: string;

    @Column({
        unique : true,
        comment: '사용자 이메일 (중복 불가)'
    })
    email: string;

    @Column({
        comment: '비밀번호 (해시된 문자열)',
    })
    password: string;

    @Column({
        type: 'enum',
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.USER,
        comment: '사용자 유형 (ADMIN, USER, GUEST 등)',
    })
    role: UserRoleEnum;

    @Column({
        default: true,
        comment: '계정 활성화 여부 (true: 활성, false: 비활성)',
    })
    isActive?: boolean;

    @VersionColumn({
        comment: '버전 관리용 컬럼 (낙관적 락)'
    })
    version: number;

    @OneToMany(_ => PostEntity, posts => posts.author, { cascade: ['insert', 'update'] })
    posts: PostEntity[];

    @OneToMany(_ => FilesEntity, files => files.uploadedBy, { cascade: true })
    files: FilesEntity[];

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable()
    roles: RoleEntity[];
}
