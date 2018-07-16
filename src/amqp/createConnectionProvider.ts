import { AmqpConnectionOptions } from '../interfaces';
import * as amqp from 'amqplib';
import resolveAmqpUrl from './resolveAmqlUrl';

export default function createConnectionProvider(
  name: number | string,
  options?: AmqpConnectionOptions,
) {
  const url = resolveAmqpUrl(options);
  return {
    provide: `amqpConnection_${options.name ? options.name : name}`,
    useFactory: async () => await amqp.connect(url),
  };
}
