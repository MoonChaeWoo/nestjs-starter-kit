import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {UsersEntity} from "../entities/users.entity";

/**
 * DB 작업 중 발생하는 에러 코드에 따라 적절한 NestJS 예외 던짐
 *
 * @param error DB 에러 객체
 */
export const handleUserDbError = (error: any): never => {
    switch (error.code) {
        // 유니크 제약조건 위반 (ex: 이메일 중복 가입)
        case '23505':
            throw new ConflictException('이미 존재하는 값');

        // 외래키 제약조건 위반 (ex: 참조하는 값 없음)
        case '23503':
            throw new BadRequestException('잘못된 참조로 인해 처리 불가');

        // NOT NULL 제약조건 위반
        case '23502':
            throw new BadRequestException('필수 값 누락');

        // 없는 유저를 업데이트/삭제 시도
        case 'NO_USER_FOUND':
            throw new NotFoundException('해당 유저 없음');

        // 기타 모든 경우
        default:
            throw new InternalServerErrorException('서버 내부 오류');
    }
};

export const checkUserEntity = (entity : any): entity is UsersEntity  => {
    return ('id' in entity && 'email' in entity) && 'nickname' in entity;
}