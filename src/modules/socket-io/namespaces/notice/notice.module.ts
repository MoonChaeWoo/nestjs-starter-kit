import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeGateway } from './notice.gateway';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatRoomsEntity} from "../../entities/chat-rooms.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomsEntity])
    ],
    providers: [NoticeGateway, NoticeService],
})
export class NoticeModule {}
