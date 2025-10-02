import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {UsersEntity} from "../../users/entities/users.entity";
import {PostEntity} from "../../post/entities/post.entity";

@Entity('files')
export class FilesEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    originalName: string;

    @Column()
    storedName: string;

    @Column()
    path: string;

    @Column()
    extension: string;

    @Column()
    size: number;

    @Column()
    mimeType: string;

    @ManyToOne(_ => PostEntity, post => post.files)
    @JoinColumn()
    post : PostEntity;

    @ManyToOne(_ => UsersEntity, (users) => users.files, { nullable: false, eager: true })
    @JoinColumn()
    uploadedBy: UsersEntity;
}