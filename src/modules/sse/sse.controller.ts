import {Body, Controller, Get, Post, Sse} from '@nestjs/common';
import {SseService} from './sse.service';
import {map, Observable} from "rxjs";
import type {MessageEvent} from "./interface/message-event.interface";
import {MessageEventDto} from "./dto/message-event.dto";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('sse - server sent event를 통한 alarm 전송')
@Controller('sse')
export class SseController {
    constructor(private readonly sseService: SseService) {}
    /**
     * 브로드캐스트 메시지 전송
     *
     * - POST /sse/broadcast
     * - 서버에서 구독중인 모든 클라이언트에게 메시지 전달
     *
     * @param body 전송할 메시지 정보
     * @returns 전송 성공 여부
     *
     * @example
     * POST /sse/broadcast
     * Body: { "message": "새 알람이 도착했습니다." }
     * Response: { "success": true }
     */
    @Post('broadcast')
    @ApiOperation({ summary: 'SSE 브로드캐스트 메시지 전송', description: '서버에서 모든 구독 클라이언트에게 메시지를 전송합니다.' })
    @ApiBody({ type: MessageEvent })
    @ApiResponse({ status: 201, description: '메시지 전송 성공', schema: { example: { success: true } } })
    broadcast(
        @Body()body: MessageEventDto
    ){
        this.sseService.broadcast(body);
        return {success: true};
    }

    /**
     * 현재 Subject Observable 반환
     *
     * - GET /sse/subject
     * - 서버의 Subject를 직접 구독하고 싶은 경우
     *
     * @returns Subject Observable
     */
    @Get('subject')
    @ApiOperation({ summary: 'SSE Subject 반환', description: '서버의 Subject Observable을 반환합니다.' })
    @ApiResponse({ status: 200, description: 'Subject Observable 반환' })
    getSubject(){
        return this.sseService.subject$;
    }

    /**
     * SSE 스트림 전송
     *
     * - GET /sse/alarm
     * - 클라이언트는 EventSource로 구독
     *
     * @returns 서버에서 전송하는 메시지 스트림
     *
     * @example (클라이언트)
     * const evtSource = new EventSource('http://localhost:3000/sse/alarm');
     * evtSource.onmessage = (event) => console.log(JSON.parse(event.data));
     */
    @Sse('alarm')
    @ApiOperation({ summary: 'SSE 알람 스트림', description: '클라이언트가 EventSource로 구독할 수 있는 SSE 스트림을 제공합니다.' })
    @ApiResponse({ status: 200, description: 'SSE 이벤트 스트림' })
    sse(): Observable<MessageEvent> {
        return this.sseService.stream$.pipe(
            map(payload => ({
                data: JSON.stringify(payload)
            })),
        );
    }
}
