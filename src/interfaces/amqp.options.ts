import { Options } from 'amqplib';

export default interface AmqpOptionsInterface extends Options.Connect {
  name?: string;
  retrys?: number;
  retryDelay?: number;
}
