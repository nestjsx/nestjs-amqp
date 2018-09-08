import {Module, DynamicModule, Provider} from '@nestjs/common';
import { AmqpOptionsInterface, AmqpAsyncOptionsInterface } from './interfaces';
import { createOptionsToken, createConnectionToken } from './utils/create.tokens';
import * as amqp from 'amqplib';

@Module({})
export default class AmqpModule {

  public static forRoot(options: AmqpOptionsInterface | AmqpOptionsInterface[]): DynamicModule {

    const optionsProviders: Provider[] = [];
    const connectionProviders: Provider[] = [];

    options = this.resolveOptions(options);

    options.forEach((options, key) => {  
      if (!options.hasOwnProperty('name')) {
        options.name = key.toString();
      }
      optionsProviders.push(this.createOptionsProvider(options));
      connectionProviders.push(this.createConnectionProvider(options));
    });

    return {
      module: AmqpModule,
      providers: [
        ...optionsProviders,
        ...connectionProviders,
      ],
      exports: connectionProviders,
    };
  }

  public static forFeature(): DynamicModule {
    return {
      module: AmqpModule,
    };
  }

  private static createOptionsProvider(options: AmqpOptionsInterface): Provider {
    return {
      provide: createOptionsToken(options.name),
      useValue: options,
    };
  }

  private static createConnectionProvider(options: AmqpOptionsInterface): Provider {
    return {
      provide: createConnectionToken(options.name),
      //TODO resolve host url
      useFactory: async (options: AmqpOptionsInterface) => await amqp.connect(options),
      inject: [createOptionsToken(options.name)],
    };
  }

  private static resolveOptions(options: AmqpOptionsInterface|AmqpOptionsInterface[]): AmqpOptionsInterface[] {
    if (!Array.isArray(options) && !options.hasOwnProperty('name')) options.name = 'default';

    if (!Array.isArray(options)) {
      options = [options];
    }

    return options;
  }
}