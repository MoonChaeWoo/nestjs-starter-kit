import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {NoticeService} from './notice.service';
import {Server, Socket} from "socket.io";
import {CorsConfig} from "../../../../config/cors/cors.config";
import {CreateChatDto} from "../../dto/create-chat.dto";

@WebSocketGateway({
    namespace: 'notice',
    cors: CorsConfig()
})
export class NoticeGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    constructor(private readonly noticeService: NoticeService) {}

    afterInit() {
        this.noticeService.server = this.server;
    }

    async handleConnection(socket: Socket) {
        await this.noticeService.handleConnection(socket);
    }

    @SubscribeMessage('create-chat')
    createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() client: Socket
    ){
        this.noticeService.createChat();
    }

    @SubscribeMessage('broadcast_message')
    broadcastMessage(
        @MessageBody() message: string
    ){
        this.noticeService.broadcastMessage(message);
    }

    @SubscribeMessage('enter_room')
    enterRoom(
        @MessageBody() rooms: string | (string | number)[],
        @ConnectedSocket() client: Socket
    ){
        this.noticeService.enterRoom(rooms, client);
    }

    @SubscribeMessage('send_room_message')
    sendRoomMessage(
        @MessageBody() data: {
            message: string,
            rooms: string | (string | number)[]
        },
    ){
        this.noticeService.sendRoomMessage(data);
    }

    @SubscribeMessage('send_broadcast_room_message')
    sendBroadcastRoomMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: {
            message: string,
            rooms: string | (string | number)[]
        }
    ){
        this.noticeService.sendBroadcastRoomMessage(client, data);
    }
}