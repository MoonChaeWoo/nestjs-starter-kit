import { Injectable } from '@nestjs/common';
import {Server, Socket} from "socket.io";
import {roomsTransform} from "../../utils/room-request-type-check.utils";
import * as cookie from "cookie";
import {checkExpiredToken} from "../../../auth/utils/auth.utils";
import {InjectRepository} from "@nestjs/typeorm";
import {ChatRoomsEntity} from "../../entities/chat-rooms.entity";


@Injectable()
export class NoticeService {
    private _server: Server;

    constructor(
        @InjectRepository(ChatRoomsEntity)
        private readonly chatRoomsEntity: ChatRoomsEntity
    ) {}

    set server(server: Server) {
        this._server = server;
    }

    async handleConnection(socket: Socket){
        const rawCookie = socket.handshake.headers.cookie || '';
        const parsed = cookie.parse(rawCookie);
        console.log('Parsed cookies:', parsed);

        const {payload, pass} = await checkExpiredToken(parsed.accessToken as string);
        console.log('Parsed cookies pass:', pass);

        console.log(`Connected client socket ID : ${socket.id}`);
    }

    broadcastMessage(message: string){
        this._server.emit('broadcastMessage', message);
    }

    enterRoom(rooms: string | (string | number)[], client: Socket){
        const roomsTrans = roomsTransform(rooms);
        client.join(roomsTrans);

        return {
            success: true,
            message : `방 ID : ${roomsTrans}에 접속함.`,
        };
    }

    sendRoomMessage(data: {
        message: string,
        rooms: string | (string | number)[]
    }){
        const roomsTrans = roomsTransform(data.rooms);
        this._server.in(roomsTrans).emit('receive_room_message', data.message);

        return {
            success: true,
            message : `방 ID : ${roomsTrans}애 메시지 전달 완료`
        };
    }

    sendBroadcastRoomMessage(client: Socket, data: { message: string; rooms: string | (string | number)[] }) {
        const roomsTrans = roomsTransform(data.rooms);
        client.to(roomsTrans).emit('receive_room_message', data.message);

        return {
            success: true,
            message : `방 ID : ${roomsTrans}애 메시지 전달 완료`
        };
    }

    createChat() {

    }
}
