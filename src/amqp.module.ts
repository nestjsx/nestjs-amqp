import {Module, DynamicModule, Provider, OnModuleDestroy} from '@nestjs/common';
import { AmqpOptionsInterface, AmqpAsyncOptionsInterface, AmqpOptionsObjectInterface } from './interfaces';
import { createConnectionToken, createOptionsToken } from './utils/create.tokens';
import {from} from 'rxjs';
import * as amqp from 'amqplib';
import retry from './utils/retry';
import { AMQP_OPTIONS_PROVIDER, } from './amqp.constants';
import { ModuleRef } from '@nestjs/core';

@Module({})
export default class AmqpModule implements OnModuleDestroy {
  private static connectionNames: string[] = [];

  constructor(private readonly moduleRef: ModuleRef) {}

  public static forRoot(options: AmqpOptionsInterface | AmqpOptionsInterface[]): DynamicModule {

    const optionsProviders: Provider[] = [];
    const connectionProviders: Provider[] = [];

    options = this.resolveOptions(options);

    optionsProviders.push(this.createOptionsProvider(options));

    options.forEach(options => {  
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

  public static forRootAsync(options: AmqpAsyncOptionsInterface): DynamicModule {
    
    AmqpModule.connectionNames.push(createConnectionToken('default'));

    const connectionProviders = [
      {
        provide: createConnectionToken('default'),
        useFactory: async (config: AmqpOptionsInterface) => await from(amqp.connect(config)).pipe(retry(options.retrys, options.retryDelay)).toPromise(),
        inject: [createOptionsToken('default')],
      },
    ];

    return {
      module: AmqpModule,
      providers: [
        {
          provide: createOptionsToken('default'),
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ...connectionProviders,
      ],
      exports: connectionProviders,
    };
  }

  private static createOptionsProvider(options: AmqpOptionsInterface[]): Provider {
    const optionsObject: AmqpOptionsObjectInterface = {};

    if (Array.isArray(options)) {
      options.forEach((options) => {
        optionsObject[options.name] = options;
      });
    }

    return {
      provide: AMQP_OPTIONS_PROVIDER,
      useValue: optionsObject,
    };
  }

  private static createConnectionProvider(options: AmqpOptionsInterface): Provider {
    AmqpModule.connectionNames.push(createConnectionToken(options.name));
    return {
      provide: createConnectionToken(options.name),
      //TODO resolve host url: do I need to? Seems to work aready? Just verify
      useFactory: async (config: AmqpOptionsObjectInterface) => await from(amqp.connect(config[options.name ? options.name : 'default'])).pipe(retry(options.retrys, options.retryDelay)).toPromise(),
      inject: [AMQP_OPTIONS_PROVIDER],
    };
  }

  private static resolveOptions(options: AmqpOptionsInterface|AmqpOptionsInterface[]): AmqpOptionsInterface[] {
    if (!Array.isArray(options) && !options.hasOwnProperty('name')) options.name = 'default';

    if (!Array.isArray(options)) {
      options = [options];
    }

    options.forEach((options, key) => {
      if (!options.hasOwnProperty('name')) {
        options.name = key.toString();
      }
    });

    return options;
  }

  async onModuleDestroy(): Promise<void> {
    AmqpModule.connectionNames.forEach(async connectionName => {
      const connection = this.moduleRef.get<amqp.Channel>(connectionName);
      connection !== null && await connection.close();
    });
  }
}