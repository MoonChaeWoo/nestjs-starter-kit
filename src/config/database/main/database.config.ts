import type { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * mainDatabaseConfig
 * ------------------
 * NestJS TypeOrmModule 비동기 설정 객체임.
 * ConfigService에서 환경변수 읽어서 DB 연결 옵션을 동적으로 생성함.
 *
 * 구성 요소:
 * - imports: [ConfigModule]
 *   - DI 컨테이너에 ConfigModule을 불러옴
 *   - useFactory에서 ConfigService를 사용하기 위해 필요함
 *
 * - inject: [ConfigService]
 *   - useFactory 함수에 주입할 의존성 지정
 *   - 여기서 ConfigService를 inject하면 useFactory 매개변수로 전달됨
 *
 * - useFactory: async (configService) => TypeOrmModuleOptions
 *   - 비동기 팩토리 함수
 *   - 환경변수를 읽어 TypeOrmModuleOptions 객체 생성
 *   - Promise 반환 가능 → NestJS가 비동기 초기화 지원
 *
 * 동작 순서:
 * 1. NestJS 모듈 초기화 시 imports에 지정된 ConfigModule 로딩
 * 2. inject에 지정된 ConfigService 인스턴스를 DI로 생성
 * 3. useFactory에 ConfigService 전달
 * 4. useFactory 내부에서 DB 연결 정보 읽고 TypeOrmModuleOptions 반환
 * 5. TypeOrmModule이 반환값 기반으로 DB 연결 초기화
 *
 * 반환값:
 * - TypeOrmModuleAsyncOptions 객체
 *
 * 사용 예:
 * TypeOrmModule.forRootAsync(mainDatabaseConfig)
 *
 * 특징:
 * - DB 연결 정보를 환경변수에서 동적으로 가져올 수 있음
 * - 비동기 초기화 지원 → ConfigService가 비동기 환경에서도 안전하게 동작
 */
export const mainDatabaseConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: configService.get<string>('DB_TYPE') as any,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
    }),
    inject: [ConfigService],
};
