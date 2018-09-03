import { Provider } from '@nestjs/common';
import { AmqpConnectionOptions } from './../interfaces';
import { AMQP_CONNECTION_OPTIONS } from './../amqp.constants';

export default function createConnectionOptionsProvider(
  options: AmqpConnectionOptions,
): Provider {
  return {
    provide: AMQP_CONNECTION_OPTIONS + '_' + options.name,
    useValue: options,
  };
}
