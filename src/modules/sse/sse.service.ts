import { Injectable } from '@nestjs/common';
import {Observable, Subject} from "rxjs";
import {MessageEventDto} from "./dto/message-event.dto";

@Injectable()
export class SseService {
    private readonly clients = new Subject<MessageEventDto>();

    constructor() {}

    get stream$(): Observable<MessageEventDto> {
        return this.clients.asObservable();
    }

    get subject$(): Observable<MessageEventDto> {
        return this.clients;
    }

    broadcast(payload: MessageEventDto) {
        this.clients.next(payload);
    }
}
