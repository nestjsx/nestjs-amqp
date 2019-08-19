import { AmqpOptionsInterface } from './amqp.options';

export interface AmqpAsyncOptionsInterface {
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<AmqpOptionsInterface> | AmqpAsyncOptionsInterface;
  retrys?: number;
  retryDelay?: number;
}
