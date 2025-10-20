import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from 'cookie-parser';
import {CreateDatabaseService} from "./config/database/main/create-database.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import expressLayouts from 'express-ejs-layouts';
import type {NestExpressApplication} from '@nestjs/platform-express';
import * as path from 'path';
import {CorsConfig} from "./config/cors/cors.config";

async function bootstrap() {
    // 초기 데이터 베이스 생성 -> 생성 이후 InitialDataDatabaseService에서 데이터 베이스 권한과 역할 기본 데이터 생성
    await CreateDatabaseService();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // cors 설정
    app.enableCors(CorsConfig());

    // public 폴더를 정적 경로로 노출
    app.useStaticAssets(path.join(__dirname, '..', 'server-side-render/public'));

    // ejs 레이아웃 미들웨어 설정
    app.use(expressLayouts);
    app.set('layout', 'base/layouts/layout-full');

    // ejs 템플릿 폴더 지정
    app.setBaseViewsDir(path.join(__dirname, '..', 'server-side-render/views'));
    app.setViewEngine('ejs');

    // 파이프 전역 설정
    app.useGlobalPipes(new ValidationPipe({
        transform: true, // 타입 변환 활성화
        //whitelist: true, // DTO에 정의되지 않은 속성 제거
        //forbidNonWhitelisted: true, // 정의되지 않은 속성이 있으면 에러 발생
        transformOptions: { enableImplicitConversion: true }, // 암묵적 타입 변환 허용
    }));

    // Swagger 등록 (API-DOCS)
    const config = new DocumentBuilder()
        .setTitle('NestJs Starter Kit API')
        .setDescription('NestJs-starter-kit API 사용법')
        .setVersion('1.0.0')
        //.addBearerAuth() // 필요시 인증 추가
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
        customSiteTitle: 'API Reference',  // 브라우저 탭에 표시될 제목
    });

    // cookie-parser 미들웨어 등록
    app.use(cookieParser());

    const PORT = process.env.PORT ?? 3000;
    await app.listen(PORT, () => {
        console.log(`NestJs Server Start Port : http://localhost:${PORT}`);
    });
}
bootstrap();
