import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {UsersEntity} from "../../users/entities/users.entity";
import {PostEntity} from "../../post/entities/post.entity";

@Entity('files')
export class FilesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', {
        comment: '파일 고유 식별자 (UUID)',
    })
    uuid: string;

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
    path: string;

    @Column({
        comment: '요청 경로',
    })
    url: string;

    @Column({
        comment: '파일 확장자 (예: jpg, png)',
    })
    extension: string;

    @Column({
        comment: '파일 크기 (바이트 단위)',
    })
    size: number;

    @Column({
        comment: '파일 MIME 타입 (예: image/png, application/pdf)',
    })
    mimetype: string;

    @Column({
        comment: '썸네일 파일 위치',
        nullable: true,
    })
    thumbnail?: string;

    @ManyToOne(() => PostEntity, post => post.files)
    @JoinColumn()
    post: PostEntity;

    @ManyToOne(() => UsersEntity, users => users.files, { nullable: false, eager: true })
    @JoinColumn()
    uploadedBy: UsersEntity;
}