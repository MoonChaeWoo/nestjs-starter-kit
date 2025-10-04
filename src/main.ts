import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {CreateDatabaseService} from "./config/database/main/create-database.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    // 초기 데이터 베이스 생성
    await CreateDatabaseService();

    const app = await NestFactory.create(AppModule);

    // Swagger 등록
    const config = new DocumentBuilder()
        .setTitle('NestJs-starter-kit API')
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
