import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {UsersEntity} from "../../users/entities/users.entity";
import {PostEntity} from "../../post/entities/post.entity";
import {Exclude, Expose, Transform} from "class-transformer";
import {join} from "path";

@Exclude()
@Entity('files')
export class FilesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', {
        comment: '파일 고유 식별자 (UUID)',
    })
    uuid: string;

    @Expose()
    @Column({
        comment: '원본 파일 이름',
    })
    originalName: string;

    @Column({
        comment: '서버에 저장된 파일 이름',
    })
    storedName: string;

    @Column({
        comment: '실제 파일 저장 경로',
    })
    @Exclude()
    path: string;

    @Expose()
    @Column({
        comment: '요청 경로',
    })
    @Transform(({value}) => value && join(process.env.FILE_DOWNLOAD_URL_PREFIX || 'upload', value))
    url: string;

    @Column({
        comment: '파일 확장자 (예: jpg, png)',
    })
    extension: string;

    @Expose()
    @Column({
        comment: '파일 크기 (바이트 단위)',
    })
    size: number;

    @Column({
        comment: '파일 MIME 타입 (예: image/png, application/pdf)',
    })
    mimetype: string;

    @Expose()
    @Column({
        comment: '썸네일 파일 위치',
        nullable: true,
    })
    @Transform(({value}) => value && join(process.env.FILE_DOWNLOAD_URL_PREFIX || 'upload', value))
    thumbnail?: string;

    @Expose()
    @ManyToOne(() => PostEntity, post => post.files)
    @JoinColumn()
    post: PostEntity | number;

    @Expose()
    @ManyToOne(() => UsersEntity, users => users.files, { nullable: false, eager: true })
    @JoinColumn()
    uploadedBy: UsersEntity | number;
}