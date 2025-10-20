import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { SocketIoController } from './socket-io.controller';
import {NoticeModule} from "./namespaces/notice/notice.module";

@Module({
    imports: [
        NoticeModule
    ],
    controllers: [SocketIoController],
    providers: [SocketIoService],
})
export class SocketIoModule {}
