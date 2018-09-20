import { AmqpOptionsInterface } from '.';

export default interface AmqpAsyncOptionsInterface {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<AmqpOptionsInterface>;
  retrys?: number;
  retryDelay?: number;
};
