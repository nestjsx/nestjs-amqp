import AmqpAsyncOptionsInterface from './amqp.options';

export default interface AmqpOptionsObjectInterface {
  [key: string]: AmqpAsyncOptionsInterface;
}
