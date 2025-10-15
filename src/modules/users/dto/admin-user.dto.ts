import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from '../../group/entities/group.entity';
import { RoleEntity } from '../../role/entities/role.entity';
import { PostEntity } from '../../post/entities/post.entity';
import { FilesEntity } from '../../files/entities/files.entity';
import UserRoleEnum from '../../../common/constants/user.constant';

export class AdminUserDto {
    @ApiProperty({ example: 1, description: '사용자 고유 식별자 (자동 증가 PK)' })
    @Expose()
    uid: number;

    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    @Expose()
    id: string;

    @ApiProperty({ example: '닉네임', description: '사용자 닉네임' })
    @Expose()
    nickname: string;

    @ApiProperty({ example: 'test@example.com', description: '사용자 이메일' })
    @Expose()
    email: string;

    @ApiProperty({ example: 'hashed_password', description: '비밀번호 (해시)' })
    @Expose()
    password: string;

    @ApiProperty({ enum: UserRoleEnum, example: UserRoleEnum.USER, description: '사용자 유형' })
    @Expose()
    role: UserRoleEnum;

    @ApiProperty({ example: true, description: '계정 활성화 여부' })
    @Expose()
    isActive: boolean;

    @ApiProperty({ example: 1, description: '버전 관리용 컬럼 (낙관적 락)' })
    @Expose()
    version: number;

    @ApiProperty({ type: () => [PostEntity], description: '작성한 게시글 목록' })
    @Expose()
    @Type(() => PostEntity)
    posts: PostEntity[];

    @ApiProperty({ type: () => [FilesEntity], description: '업로드한 파일 목록' })
    @Expose()
    @Type(() => FilesEntity)
    files: FilesEntity[];

    @ApiProperty({ type: () => [RoleEntity], description: '사용자 역할 목록' })
    @Expose()
    @Type(() => RoleEntity)
    roles: RoleEntity[];

    @ApiProperty({ type: () => [GroupEntity], description: '사용자가 속한 그룹 목록' })
    @Expose()
    @Type(() => GroupEntity)
    group: GroupEntity[];
}