import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * CreateDatabaseService
 * ---------------------
 * DB 서버에 연결함.
 * 지정한 데이터베이스가 존재하는지 확인함.
 * 없으면 새로 생성함.
 * 모든 과정 비동기 처리됨.
 *
 * 환경변수 사용:
 * - DB_HOST: DB 서버 주소, 없으면 연결 불가함
 * - DB_PORT: DB 포트, 숫자로 변환해서 사용함
 * - DB_USERNAME: DB 접속 사용자
 * - DB_PASSWORD: DB 접속 비밀번호
 *
 * 동작 순서:
 * 1. Client 객체 생성함. 환경변수 기반으로 접속 정보 세팅함.
 * 2. DB 서버에 연결 시도함. 실패 시 에러 던짐.
 * 3. DB 서버d에서 지정 DB 존재 여부 확인함.
 * 4. 데이터베이스 없으면 CREATE DATABASE 쿼리 실행함.
 * 5. 데이터베이스 이미 있으면 생성하지 않고 메시지 출력함.
 * 6. 모든 작업 끝나면 연결 종료함.
 *
 * 반환:
 * - Promise<void>: 모든 작업 완료 시 반환됨
 *
 * 예외:
 * - DB 연결 실패, 쿼리 실패 등 발생 시 에러 던짐
 *
 * 사용 예:
 * await CreateDatabaseService();
 */
export const CreateDatabaseService = async () => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    });

    await client.connect();

    const dbName = process.env.DB_DATABASE;
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (res.rowCount === 0) {
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database created: ${dbName}`);
    }
    await client.end();
};