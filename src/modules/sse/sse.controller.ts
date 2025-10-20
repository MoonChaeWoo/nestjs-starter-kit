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
    @ApiOperation({
        summary: 'SSE 브로드캐스트 메시지 전송',
        description: `
서버에서 **현재 SSE를 구독 중인 모든 클라이언트**에게 메시지를 전송합니다.

### 💡 사용 예시 (클라이언트)
\`\`\`js
fetch('http://localhost:3000/sse/broadcast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: { message: '서버에서 보낸 테스트 메시지' },
    type: 'alarm',
  }),
})
  .then(res => res.json())
  .then(console.log);
\`\`\`
    `,
    })
    @ApiBody({
        type: MessageEventDto,
        required: true,
        examples: {
            simple: {
                summary: '기본 알림 메시지',
                description: '단순한 문자열 메시지 형태의 예시',
                value: {
                    data: '서버에서 보낸 공지사항입니다.',
                    type: 'notice',
                },
            },
            object: {
                summary: '객체 형태의 메시지',
                description: 'data가 객체일 경우의 예시',
                value: {
                    data: {
                        title: '새로운 채팅 메시지',
                        content: '안녕하세요! SSE 테스트 중입니다.',
                    },
                    type: 'chat',
                    timestamp: 1730000000000,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: '메시지 전송 성공',
        schema: {
            example: { success: true },
        },
    })
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
    @ApiOperation({
        summary: 'SSE 알람 스트림',
        description: `
이 API는 클라이언트가 **Server-Sent Events(SSE)** 형식으로 알람을 수신할 수 있게 합니다.

**클라이언트 사용 예시:**
\`\`\`js
const eventSource = new EventSource('http://localhost:3000/sse/alarm');

eventSource.onmessage = ({ data }) => {
  console.log('New message:', JSON.parse(data));
};

eventSource.onopen = () => console.log('SSE connected');
eventSource.onerror = (err) => console.error('SSE error:', err);
\`\`\`
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'SSE 이벤트 스트림 (Content-Type: text/event-stream)',
        schema: {
            example: {
                data: '{"message":"테스트 알람","timestamp":"2025-10-20T15:00:00Z"}',
            },
        },
    })
    subscribe(): Observable<MessageEvent> {
        return this.sseService.stream$.pipe(
            map(payload => ({
                data: JSON.stringify(payload)
            })),
        );
    }
}
