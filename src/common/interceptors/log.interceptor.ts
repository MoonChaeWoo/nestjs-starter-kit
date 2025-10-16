import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable, tap} from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const requestUrl = request.originalUrl;
        const reqUser = request?.id || request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress;;

        const now = new Date();
        console.log(`[REQUEST] URL : ${requestUrl} 
          REQUESTER : ${reqUser}
          TIME : ${now.toLocaleString('kr')}`);

        return next
            .handle()
            .pipe(
                tap(
                    _ => console.log(`[RESPONSE] URL : ${requestUrl} 
           REQUESTER : ${reqUser}
           TIME : ${now.toLocaleString('kr')} 
           TIME TAKEN : ${(new Date().getTime() - now.getTime()) / 1000}s`)
                ),
            );
    }
}