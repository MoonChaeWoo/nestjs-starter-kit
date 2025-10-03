import {AuthEmailContext, VerificationData} from "../interface/auth.interface";
import {randomInt} from "crypto";
import {JwtService} from "@nestjs/jwt";

/**
 * 인증 코드 context 생성함
 *
 * - 랜덤 6자리 인증 코드 생성
 * - verificationMap에 clientEmail 키로 저장 (code, expiresAt)
 * - 반환값은 AuthEmailContext 형태
 *
 * @param verificationMap 인증 코드 저장 Map
 * @param clientEmail 클라이언트 이메일
 * @returns AuthEmailContext (title, verificationCode, projectOwner)
 */
export const createContext = (
    verificationMap : Map<string, VerificationData>,
    clientEmail : string
): AuthEmailContext => {
    const verificationCode = randomInt(100000, 999999);

    verificationMap.set(clientEmail, {
        code: verificationCode,
        expiresAt: new Date().getTime()
    });

    return {
        title : '메일 인증',
        verificationCode,
        projectOwner : 'Admin',
    };
};

/**
 * 인증 코드 만료 체크함
 *
 * - verificationMap 순회
 * - expiresAt이 지정한 minute 이상이면 삭제
 *
 * @param verificationMap 인증 코드 저장 Map
 * @param minute 만료 기준 시간 (분)
 */
export const checkExpiresAt = (verificationMap : Map<string, VerificationData>, minute : number) => {
    // 10분 제한
    const limitTime = (60 * 1000) * minute;

    // 10분 이상이 지난 이메일에 대한 키값 제거
    Array.from(verificationMap).forEach(object => {
        const key = object[0];
        const value = object[1];
        const currentTime = value.expiresAt;

        if(currentTime > limitTime){
            verificationMap.delete(key);
        }
    })
};

export const checkExpiredToken = async(token: string): Promise<{payload, pass : boolean}> => {
    try {
        const jwtService = new JwtService();
        const payload = await jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY});
        return {
            payload,
            pass : true
        };
    } catch (error) {
        return {
            payload : error,
            pass : false
        };
    }
}
