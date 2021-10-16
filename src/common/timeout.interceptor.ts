import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const millisecondInMin = 1000 * 60;
const timeOutMinute = 5;

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(timeOutMinute * millisecondInMin),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(new RequestTimeoutException());
                }
                return throwError(err);
            }),
        );
    }
}
