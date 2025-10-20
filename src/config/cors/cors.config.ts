import {ForbiddenException} from "@nestjs/common";
export const CorsConfig = () => {
    if(!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN.replace(/["|']/g, '') === '*'){
        return({
            origin(origin, callback){
                    callback(null, true);
            }
        });
    }else{
        const allowCorsDomains = process.env.CORS_ORIGIN.replaceAll(' ', '').split(',');

        return({
            origin(origin, callback){
                if(!origin || (/^http.*/.test(origin) && allowCorsDomains.includes((new URL(origin).hostname)))){
                    callback(null, true);
                }else{
                    callback(new ForbiddenException('CORS 정책으로 인해 요청이 차단되었습니다.'), false);
                }
            }
        });
    }
};