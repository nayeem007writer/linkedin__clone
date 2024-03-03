import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { CustomHttpExceptionResponse, HttpExceptionResponse } from "./models/http-exception-response.interface";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;

        if(exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            errorMessage =(errorResponse as HttpExceptionResponse).error || exception.message;

        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = "Critical internal server error accurred!"
        }

        const errorResponse = this.getErrorResponse(status, errorMessage, request);
        const errorLog = this.getErrorLog(errorResponse, request, exception);

    }

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string,
        request: Request,
      ): CustomHttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date(),
      });

      private getErrorLog = (
        errorResponse: CustomHttpExceptionResponse,
        request: Request,
        exception: unknown,
      ): string => {
        const { statusCode, error } = errorResponse;
        const { method, url,  } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
        ${JSON.stringify(errorResponse)}\n\n
        User: ${JSON.stringify(request.body?? 'Not signed in')}\n\n
        ${exception instanceof HttpException ? exception.stack : error}\n\n`;
        console.log(7, errorLog)
        return errorLog;
      };  
}