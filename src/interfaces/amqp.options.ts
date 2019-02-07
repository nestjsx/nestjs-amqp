import { Options } from 'amqplib';

export interface AmqpOptionsInterface extends Partial<Options.Connect> {
  name?: string;
  retrys?: number;
  retryDelay?: number;
}
