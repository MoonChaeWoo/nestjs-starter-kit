import {
    Column,
    Entity, JoinTable, ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    VersionColumn
} from "typeorm";
import UserRoleEnum from "../../../common/constants/user.constant";
import {PostEntity} from "../../post/entities/post.entity";
import {BaseEntity} from "../../../common/entities/base.entity";
import {FilesEntity} from "../../files/entities/files.entity";
import {GroupEntity} from "../../group/entities/group.entity";
import {RoleEntity} from "../../role/entities/role.entity";
import {Exclude, Expose} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";


@Entity('users')
@Exclude()
export class UsersEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        comment: '사용자 고유 식별자 (자동 증가 PK)',
    })
    @Expose()
    @ApiProperty({ example: 1, description: '사용자 고유 식별자 (자동 증가 PK)' })
    uid: number;

    @ManyToMany(() => GroupEntity, (group) => group.users)
    @Expose()
    @ApiProperty({ type: () => [GroupEntity], description: '사용자가 속한 그룹 목록' })
    group: GroupEntity[];

    @Expose()
    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    @Column({
        unique: true,
        length: 20,
        comment: '로그인용 사용자 ID (중복 불가)',
    })
    id: string;

    @Expose()
    @ApiProperty({ example: '닉네임', description: '사용자 닉네임' })
    @Column({
        unique: true,
        length: 20,
        comment: '사용자 닉네임 (중복 불가)',
    })
    nickname: string;

    @Expose()
    @ApiProperty({ example: 'test@example.com', description: '사용자 이메일' })
    @Column({
        unique: true,
        comment: '사용자 이메일 (중복 불가)',
    })
    email: string;

    @Column({
        comment: '비밀번호 (해시된 문자열)',
    })
    password: string; // 노출 X

    @Expose()
    @ApiProperty({ enum: UserRoleEnum, example: UserRoleEnum.USER, description: '사용자 유형' })
    @Column({
        type: 'enum',
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.USER,
        comment: '사용자 유형 (ADMIN, USER, GUEST 등)',
    })
    role: UserRoleEnum;

    @Expose()
    @ApiProperty({ example: true, description: '계정 활성화 여부 (true: 활성, false: 비활성)' })
    @Column({
        default: true,
        comment: '계정 활성화 여부 (true: 활성, false: 비활성)',
    })
    isActive?: boolean = true;

    @Expose()
    @ApiProperty({ example: 1, description: '버전 관리용 컬럼 (낙관적 락)' })
    @VersionColumn({
        comment: '버전 관리용 컬럼 (낙관적 락)',
    })
    version: number;

    @OneToMany(() => PostEntity, (posts) => posts.author, { cascade: ['insert', 'update'] })
    @Expose()
    @ApiProperty({ type: () => [PostEntity], description: '작성한 게시글 목록' })
    posts: PostEntity[];

    @OneToMany(() => FilesEntity, (files) => files.uploadedBy, { cascade: true })
    @Expose()
    @ApiProperty({ type: () => [FilesEntity], description: '업로드한 파일 목록' })
    files: FilesEntity[];

    @ManyToMany(() => RoleEntity, (role) => role.users)
    @JoinTable()
    @Expose()
    @ApiProperty({ type: () => [RoleEntity], description: '사용자 역할 목록' })
    roles: RoleEntity[];
}