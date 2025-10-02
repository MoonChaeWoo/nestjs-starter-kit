import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {CreateDatabaseService} from "./config/database/main/create-database.service";

async function bootstrap() {
    // 초기 데이터 베이스 생성
    await CreateDatabaseService();

    const app = await NestFactory.create(AppModule);

    // cookie-parser 미들웨어 등록
    app.use(cookieParser());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
