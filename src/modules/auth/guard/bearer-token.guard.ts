import {CanActivate, ExecutionContext, Injectable, Logger, LoggerService, UnauthorizedException} from "@nestjs/common";
import {checkExpiredToken} from "../utils/auth.utils";
import {AuthService} from "../auth.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    private readonly logger = new Logger(BearerTokenGuard.name);

    constructor(
        private readonly authService: AuthService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const [accessToken, refreshToken] = await Array.fromAsync([
            await checkExpiredToken(req.cookies.accessToken),
            await checkExpiredToken(req.cookies.refreshToken),
        ]);

        if(!accessToken.pass && !refreshToken.pass){
            throw new UnauthorizedException('토큰이 만료되었습니다. 새로운 토큰을 발급받아 다시 시도해주세요.');
        }

        if(!accessToken.pass && refreshToken.pass){
            try{
                const {tokens} = await this.authService.reissueToken(res, 'access', {
                    accessToken : req.cookies.accessToken,
                    refreshToken : req.cookies.refreshToken,
                }, true);
                req.cookies.accessToken = tokens!.accessToken;

                return (await checkExpiredToken(req.cookies.accessToken)).pass;
            }catch(error){
                this.logger.error(error);
                throw error;
            }
        }

        req.id = accessToken.payload.id;
        req.email = accessToken.payload.email;

        return accessToken.pass;
    }

}