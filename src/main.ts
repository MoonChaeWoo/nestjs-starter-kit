import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {CreateDatabaseService} from "./config/database/main/create-database.service";

async function bootstrap() {
    // 초기 데이터 베이스 생성
    await CreateDatabaseService();

    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
