import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('WebSocket');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const event = context.getHandler().name;

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.log(
          `Event: ${event} | Client: ${client.id} | Time: ${elapsed}ms`,
        );
      }),
    );
  }
}
