import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {catchError, concatMap, finalize, from, map, Observable, tap} from "rxjs";
import {DataSource} from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
         const request = context.switchToHttp().getRequest();

         const queryRunner = this.dataSource.createQueryRunner();
         queryRunner.connect();
         queryRunner.startTransaction();

        request.queryRunner = queryRunner;

        return next.handle().pipe(
            concatMap(result => from(queryRunner.commitTransaction()).pipe(
                concatMap(() => [result])
            )),
            catchError(err =>
                from(queryRunner.rollbackTransaction()).pipe(
                    concatMap(() => { throw err; })
                )
            ),
            finalize(() => from(queryRunner.release()))
        );
    }
}