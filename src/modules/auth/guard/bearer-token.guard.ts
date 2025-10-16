import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {checkExpiredToken} from "../utils/auth.utils";
import {AuthService} from "../auth.service";

/**
 * BearerTokenGuard
 *
 * JWT 인증 및 자동 재발급 로직을 처리하는 인증 가드
 *
 * 주요 기능:
 * 1. AccessToken, RefreshToken 만료 여부를 검사
 * 2. AccessToken이 만료되고 RefreshToken이 유효한 경우 → AccessToken 자동 재발급
 * 3. RefreshToken만 만료된 경우 → RefreshToken 자동 재발급
 * 4. 두 토큰 모두 만료된 경우 → 인증 실패 (UnauthorizedException)
 * 5. 관리자(서버)에서 강제 쿠키 초기화 설정(forceCookieReset)이 true일 경우 → 즉시 로그아웃 처리
 * 6. RefreshToken의 남은 유효시간이 1시간 미만일 경우 자동 갱신
 *
 * 부가 처리:
 * - 유효한 AccessToken의 payload에서 사용자 id, email을 request 객체에 주입함
 * - 모든 예외 상황은 Nest의 UnauthorizedException 또는 InternalServerErrorException으로 처리됨
 *
 * @returns {Promise<boolean>} 인증 성공 시 true, 실패 시 예외 발생
 *
 * @example
 * // 사용 예시
 * @UseGuards(BearerTokenGuard)
 * @Get('profile')
 * getProfile(@Req() req) {
 *   return { userId: req.id, email: req.email };
 * }
 */
@Injectable()
export class BearerTokenGuard implements CanActivate {
    private readonly logger = new Logger(BearerTokenGuard.name);

    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        let tokenCheckResult: boolean = false;
        try{
            const [accessToken, refreshToken] = await Array.fromAsync([
                await checkExpiredToken(req.cookies.accessToken),
                await checkExpiredToken(req.cookies.refreshToken),
            ]);

            // 관리자(서버)에서 강제 쿠키 초기화 설정(forceCookieReset)이 true일 경우 → 즉시 로그아웃 처리
            if(this.authService.forceCookieReset){
                this.authService.logoutUser(res);
                throw new UnauthorizedException('시스템의 토큰 보안 강화 조치로 인해 현재 로그아웃 처리되었습니다. ' +
                    '고객님의 안전한 서비스 이용을 위한 조치이오니 양해 부탁드립니다.');
            }

            if(!accessToken.pass && !refreshToken.pass){
                // 토큰 둘 다 유효하지 못했을 시 거부
                throw new UnauthorizedException('토큰이 유효하지 않거나 만료되었습니다. 다시 로그인해 주시면 정상적으로 서비스를 이용하실 수 있습니다.');
            } else if(!accessToken.pass && refreshToken.pass){
                // 접근 토큰이 유효하지 못하고 리프레쉬 토큰은 유효 시 접근 토큰 재발급
                const {tokens} = await this.authService.reissueToken(res, 'access', {
                    accessToken : req.cookies.accessToken,
                    refreshToken : req.cookies.refreshToken,
                }, true);
                req.cookies.accessToken = tokens!.accessToken;
                tokenCheckResult = (await checkExpiredToken(req.cookies.accessToken)).pass;
            }else if(accessToken.pass && !refreshToken.pass){
                // 접근 토큰은 유효하되 리프레쉬 토큰이 유효하지 못했을 때 리프레쉬 토큰 재발급
                const {tokens} = await this.authService.reissueToken(res, 'refresh', {
                    accessToken : req.cookies.accessToken,
                    refreshToken : req.cookies.refreshToken,
                }, true);
                req.cookies.refreshToken = tokens!.refreshToken;
                tokenCheckResult = accessToken.pass;
            }else{
                // 접근 토큰, 리프레쉬 토큰 둘다 유효 시 리프레쉬 토큰 시간이 1시간 미만으로 남았을 시 자동 재발급
                const remainingTime = ((new Date().getTime() - (refreshToken.payload.exp * 1000)) * -1) / 60000;
                if(remainingTime < 60){
                    const {tokens} = await this.authService.reissueToken(res, 'refresh', {
                        accessToken : req.cookies.accessToken,
                        refreshToken : req.cookies.refreshToken,
                    }, true);
                    req.cookies.refreshToken = tokens!.refreshToken;
                }
                tokenCheckResult = accessToken.pass;
            }

            req.uid = accessToken.payload.uid;
            req.id = accessToken.payload.id;
            req.email = accessToken.payload.email;

            return tokenCheckResult;
        }catch(error){
            this.logger.error(error);
            throw error;
        }
    }
}