import { AmqpConnectionOptions } from '../interfaces';
import * as amqp from 'amqplib';
import resolveAmqpUrl from './resolveAmqlUrl';
import { Provider } from '@nestjs/common';
import createOptionsToken from './createOptionsToken';
import createProviderToken from './createProviderToken';

export default function createConnectionProvider(
  options: AmqpConnectionOptions = { name: 'default', host: 'localhost' },
): Provider {
  return {
    provide: createProviderToken(options.name),
    useFactory: async (options: AmqpConnectionOptions): Promise<Object> => {
      return await amqp.connect(resolveAmqpUrl(options));
    },
    inject: [createOptionsToken(options.name)],
  };
}
