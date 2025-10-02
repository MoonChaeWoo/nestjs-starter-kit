import { ConfigModule, ConfigService } from '@nestjs/config';
import type {MailerAsyncOptions} from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import * as path from "path";
import {EjsAdapter} from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
/**
 * GoogleMailConfig
 * ----------------
 * NestJS MailerModule 비동기 설정 객체임.
 * ConfigService에서 환경변수 읽어서 SMTP 메일러 옵션을 동적으로 생성함.
 *
 * 구성 요소:
 * - imports: [ConfigModule]
 *   - DI 컨테이너에 ConfigModule 불러옴
 *   - useFactory에서 ConfigService 사용 가능하게 함
 *
 * - inject: [ConfigService]
 *   - useFactory 함수에 주입할 의존성 지정
 *   - ConfigService가 useFactory 매개변수로 전달됨
 *
 * - useFactory: async (config: ConfigService) => MailerModuleOptions
 *   - 비동기 팩토리 함수
 *   - 환경변수를 읽어 MailerModule 옵션 객체 생성
 *   - Promise 반환 가능 → NestJS가 비동기 초기화 지원
 *
 * 동작 순서:
 * 1. NestJS 모듈 초기화 시 imports에 지정된 ConfigModule 로딩
 * 2. inject에 지정된 ConfigService 인스턴스를 DI로 생성
 * 3. useFactory에 ConfigService 전달
 * 4. useFactory 내부에서 SMTP 연결 정보 읽고 MailerModuleOptions 반환
 * 5. MailerModule이 반환값 기반으로 메일러 초기화
 *
 * 반환값:
 * - MailerAsyncOptions 객체
 *
 * 사용 예:
 * MailerModule.forRootAsync(GoogleMailConfig)
 *
 * 특징:
 * - 메일 서버 연결 정보를 환경변수에서 동적으로 가져올 수 있음
 * - 비동기 초기화 지원 → ConfigService가 비동기 환경에서도 안전하게 동작
 */
export const GoogleMailConfig: MailerAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
        transport: {
            host: config.get('GOOGLE_SMTP_MAIL_HOST'),
            port: config.get('GOOGLE_SMTP_MAIL_PORT'),
            auth: {
                user: config.get('GOOGLE_SMTP_MAIL_USER'),
                pass: config.get('GOOGLE_SMTP_MAIL_PASSWORD'),
            },
        },
        defaults: {
            from: config.get('GOOGLE_SMTP_DEFAULT_FROM'),
        },
        template : {
            dir : path.join(__dirname, '../', './templates'),
            adapter : new EjsAdapter(),
            options : {
                static: false
            }
        }
    })
};