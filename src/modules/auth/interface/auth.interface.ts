/**
 * 메일 인증 템플릿에 전달할 context 구조
 *
 * - title: 메일 제목
 * - verificationCode: 6자리 인증 코드
 * - projectOwner: 프로젝트 관리자 이름
 */
export interface AuthEmailContext{
    title : string;
    verificationCode : number;
    projectOwner : string;
}

/**
 * 인증 코드 저장용 데이터 구조
 *
 * - code: 발급된 인증 코드
 * - expiresAt: 발급 시각 (밀리초)
 */
export interface VerificationData {
    code: number;
    expiresAt: number;
}

export interface TokenType{
    accessToken: string;
    refreshToken: string;
}