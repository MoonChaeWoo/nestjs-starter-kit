import {All, Controller, Delete, Get, Head, Options, Patch, Post, Put, Req, Res} from '@nestjs/common';
import {ProxyService} from './proxy.service';
import type {Request, Response} from 'express';
import {ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('proxy - 서버사이드 프록시로 활용')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}
    // ------------------ GET ------------------
    @Get()
    @ApiOperation({
        summary: 'GET 프록시 요청',
        description: `
외부 API로 GET 요청을 전달합니다.  
예시:  
\`GET /proxy?url=https://jsonplaceholder.typicode.com/posts/1\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://jsonplaceholder.typicode.com/posts/1' })
    @ApiResponse({ status: 200, description: '성공적으로 데이터 반환' })
    async proxyGet(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }

    // ------------------ POST ------------------
    @Post()
    @ApiOperation({
        summary: 'POST 프록시 요청',
        description: `
외부 API로 POST 요청을 전달합니다.  
요청 바디는 그대로 전달됩니다.  
예시:  
\`POST /proxy?url=https://jsonplaceholder.typicode.com/posts\`

Body:
\`\`\`json
{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
\`\`\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://jsonplaceholder.typicode.com/posts' })
    @ApiResponse({ status: 201, description: '데이터 생성 성공' })
    async proxyPost(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }

    // ------------------ PUT ------------------
    @Put()
    @ApiOperation({
        summary: 'PUT 프록시 요청',
        description: `
외부 API로 PUT 요청을 전달합니다.  
예시:  
\`PUT /proxy?url=https://jsonplaceholder.typicode.com/posts/1\`

Body:
\`\`\`json
{
  "id": 1,
  "title": "updated title",
  "body": "updated content"
}
\`\`\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://jsonplaceholder.typicode.com/posts/1' })
    @ApiResponse({ status: 200, description: '데이터 수정 성공' })
    async proxyPut(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }

    // ------------------ DELETE ------------------
    @Delete()
    @ApiOperation({
        summary: 'DELETE 프록시 요청',
        description: `
외부 API로 DELETE 요청을 전달합니다.  
예시:  
\`DELETE /proxy?url=https://jsonplaceholder.typicode.com/posts/1\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://jsonplaceholder.typicode.com/posts/1' })
    @ApiResponse({ status: 200, description: '데이터 삭제 성공' })
    async proxyDelete(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }

    // ------------------ PATCH ------------------
    @Patch()
    @ApiOperation({
        summary: 'PATCH 프록시 요청',
        description: `
외부 API로 PATCH 요청을 전달합니다.  
예시:  
\`PATCH /proxy?url=https://jsonplaceholder.typicode.com/posts/1\`

Body:
\`\`\`json
{
  "title": "partially updated title"
}
\`\`\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://jsonplaceholder.typicode.com/posts/1' })
    @ApiResponse({ status: 200, description: '부분 수정 성공' })
    async proxyPatch(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }

    // ------------------ OPTIONS ------------------
    @Options()
    @ApiOperation({
        summary: 'OPTIONS 프록시 요청',
        description: `
외부 API의 허용된 HTTP 메서드를 확인합니다.  
예시:  
\`OPTIONS /proxy?url=https://example.com/resource\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://example.com/resource' })
    @ApiResponse({ status: 200, description: '허용된 메서드 반환' })
    async proxyOptions(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }

    // ------------------ HEAD ------------------
    @Head()
    @ApiOperation({
        summary: 'HEAD 프록시 요청',
        description: `
외부 API의 헤더만 반환합니다.  
예시:  
\`HEAD /proxy?url=https://jsonplaceholder.typicode.com/posts/1\`
    `,
    })
    @ApiQuery({ name: 'url', required: true, example: 'https://jsonplaceholder.typicode.com/posts/1' })
    @ApiResponse({ status: 200, description: '헤더 반환 성공' })
    async proxyHead(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.proxyRequest(req, res);
    }
}
