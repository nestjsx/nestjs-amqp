import AmqpOptionsInterface from './amqp.options';

export default interface AmqpAsyncOptionsInterface {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<AmqpOptionsInterface>;
}
