import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,          // 5초
            maxRedirects: 5,        // 최대 5번 리다이렉트 허용
            validateStatus: (status) => status >= 200 && status < 300
        })
    ],
    controllers: [ProxyController],
    providers: [ProxyService],
})
export class ProxyModule {}
