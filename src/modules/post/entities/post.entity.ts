import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import {BaseEntity} from "../../../common/entities/base.entity";
import {FilesEntity} from "../../files/entities/files.entity";

@Entity('posts')
export class PostEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        comment: '게시글 고유 식별자 (자동 증가 PK)',
    })
    uid: number;

    @ManyToOne(() => UsersEntity, (user) => user.posts, { eager: true })
    author: UsersEntity;

    @OneToMany(() => FilesEntity, (files) => files.post, { eager: true })
    files: FilesEntity[] | string[];

    @Column({
        comment: '게시글 제목',
    })
    title: string;

    @Column({
        comment: '게시글 내용',
    })
    content: string;

    @Column({
        default: 0,
        comment: '좋아요 갯수',
    })
    likeCount?: number = 0;
}
