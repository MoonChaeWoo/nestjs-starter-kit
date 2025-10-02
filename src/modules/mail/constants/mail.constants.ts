import {BadRequestException, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";

export const handleMailError = (errorCode : number): never => {
    switch (errorCode) {
        // 잘못된 수신자
        case 550:
        case 551:
        case 552:
        case 553:
            throw new BadRequestException('잘못된 수신자 이메일 주소');

        // 인증 문제
        case 530:
        case 534:
        case 535:
        case 538:
            throw new UnauthorizedException('메일 서버 인증 실패 또는 TLS 필요');

        // 서버 문제
        case 421:
        case 450:
        case 451:
        case 452:
        case 454:
        case 554:
            throw new InternalServerErrorException('메일 서버 일시적 오류');

        // 명령 오류
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
            throw new BadRequestException('SMTP 명령 구문 오류');

        // 연결 오류는 responseCode가 없을 수도 있음
        default:
            throw new InternalServerErrorException('메일 전송 중 알 수 없는 오류');
    }
}