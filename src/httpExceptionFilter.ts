import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { HttpExceptionResponse } from "./types/ExceptionTypes";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor (private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const {httpAdapter} = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log("Exception :: ==> ", exception)

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : String(exception);
    const responseBody = {
      statusCode: httpStatus,
      timeStamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest),
      message: (exceptionResponse as HttpExceptionResponse).error || (exceptionResponse as HttpExceptionResponse).message ||  exceptionResponse || 'Something went wrong!!',
      error: exceptionResponse
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}