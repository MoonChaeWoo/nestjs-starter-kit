import { Injectable } from '@nestjs/common';
import {Request, Response} from "express";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import * as stream from "node:stream";

@Injectable()
export class ProxyService {
    constructor(private readonly httpService: HttpService) {}

    sanitizeHeaders(headers: Record<string, any> | undefined) {
        if (!headers) return {};

        const normalized: Record<string, any> = {};
        Object.entries(headers).forEach(([k, v]) => {
            normalized[k.toLowerCase()] = v;
        });

        const hopByHop = [
            'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
            'te', 'trailers', 'transfer-encoding', 'upgrade', 'host',
        ];

        hopByHop.forEach(h => {
            if (h in normalized) delete normalized[h];
        });

        return normalized;
    }

    async proxyRequest(req: Request, res: Response) {
        try{
            const observable = this.httpService.request({
                method: req.method as any,      // GET, POST 등 그대로 전달
                url: req.originalUrl.replace('/proxy?url=', ''),
                headers: this.sanitizeHeaders(req.headers as Record<string, any>),
                data: req.body,                 // POST/PUT 등 바디 그대로
            });

            const response = await firstValueFrom(observable);

            res.status(response.status);
            Object.entries(response.headers).forEach(([key, value]) => {
                res.setHeader(key, value as string);
            });

            const contentType = response.headers['content-type'] || '';
            const data = response.data;

            if (contentType.includes('application/json')) {
                // JSON
                res.json(data);
            } else if (contentType.startsWith('text/')) {
                // 텍스트 (HTML, XML, CSV 등)
                res.send(data);
            } else if (Buffer.isBuffer(data) || typeof data.pipe === 'function') {
                // 스트림 / 파일 / 이미지 / PDF / 기타 바이너리
                const bufferStream = typeof data.pipe === 'function' ? data : (() => {
                    const pass = new stream.PassThrough();
                    pass.end(data);
                    return pass;
                })();
                bufferStream.pipe(res);
            } else {
                res.send(String(data));
            }
        } catch (err: any) {
            res.status(err.response?.status || 500).send(err.message || 'Proxy Error');
        }
    }
}
