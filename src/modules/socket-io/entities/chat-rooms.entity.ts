import {Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "../../users/entities/users.entity";
import {BaseEntity} from "../../../common/entities/base.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity('chat_rooms')
export class ChatRoomsEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        comment: '채팅방 고유 식별자 (자동 증가 PK)',
    })
    @ApiProperty({ example: 1, description: '채팅방 고유 식별자 (자동 증가 PK)' })
    uid: number;

    @ManyToMany(() => UsersEntity, (user) => user.chats)
    users: UsersEntity[];
}