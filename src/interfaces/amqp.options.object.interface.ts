import AmqpAsyncOptionsInterface from './amqp.options';

export interface AmqpOptionsObjectInterface {
  [key: string]: AmqpAsyncOptionsInterface;
}
