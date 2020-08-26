import { Observable } from 'rxjs';
import { retryWhen, scan, delay } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

export default function retry(
  retryAttempts: number = 3,
  retryDelay: number = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((acc: number, error: Error) => {
            Logger.error(
              `Unable to connect to amqp server. Retrying`,
              error.stack,
              'AmqpModule',
            );
            if (acc + 1 >= retryAttempts) {
              throw error;
            }
            return acc + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}
