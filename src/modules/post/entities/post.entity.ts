import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import {BaseEntity} from "../../../common/entities/base.entity";
import {FilesEntity} from "../../files/entities/files.entity";

@Entity('posts')
export class PostEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    uid: number;

    @ManyToOne(_ => UsersEntity, (user) => user.posts, { eager: true })
    author: UsersEntity;

    @OneToMany(_ => FilesEntity, (files) => files.post, { eager: true })
    files: FilesEntity[];

    @Column()
    title: string;

    @Column()
    content: string;
}
