import { AmqpAsyncOptionsInterface } from './amqp.async.options';

export interface AmqpOptionsObjectInterface {
  [key: string]: AmqpAsyncOptionsInterface;
}
