import { AmqpOptionsInterface } from './amqp.options';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface AmqpAsyncOptionsInterface extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<AmqpOptionsInterface> | AmqpOptionsInterface;
  retrys?: number;
  retryDelay?: number;
}
