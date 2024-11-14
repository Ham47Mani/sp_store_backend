import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ResponseData } from "./types/ResponseDataTypes";

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor  {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ResponseData<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;

    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data.result,
        timeStamp: new Date(),
        statusCode,
        path,
        error: null
      }))
    )
  }
}