import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {CreateDatabaseService} from "./config/database/main/create-database.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Logger, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    // 초기 데이터 베이스 생성
    await CreateDatabaseService();

    const app = await NestFactory.create(AppModule);

    // TODO 전역 로그 설정
    // app.useLogger(Logger);

    // 파이프 전역 설정
    app.useGlobalPipes(new ValidationPipe({
        transform: true, // 타입 변환 활성화
        whitelist: true, // DTO에 정의되지 않은 속성 제거
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

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
