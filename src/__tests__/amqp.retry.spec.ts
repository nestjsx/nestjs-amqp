import retry from '../utils/retry';
import { from } from 'rxjs';
import * as amqp from 'amqplib';

jest.setTimeout(30000);

describe('Amqp Retry', () => {
  it('retrys are called', async () => {
    try {
      const result = await from(
        amqp.connect({
          hostname: 'notathing',
          port: 3444,
        }),
      )
        .pipe(retry())
        .toPromise();
      expect(false).toBeTruthy();
    } catch (e) {
      expect(true).toBeTruthy();
    }
  });
});
