import { Module, DynamicModule, Global, Provider } from "@nestjs/common";
import { AmqpConnectionOptions, AmqpConnectionAsyncOptions } from "./interfaces";
import { createConnectionOptionsProvider, createConnectionProvider } from "./amqp";

@Global()
@Module({})
export default class AMQPModule {
  public static forRoot(
    options?: AmqpConnectionOptions[] | AmqpConnectionOptions
  ): DynamicModule {

    const providersOptions = this.createOptionsProviders(Array.isArray(options) ? options : [options]);
    const providers = this.createConnectionProviders(Array.isArray(options) ? options : [options]);
    
    return {
      module: AMQPModule,
      providers: [
        ...providersOptions,
        ...providers,
      ],
      exports: providers,
    };
  }

  public static forRootAsync(options: AmqpConnectionAsyncOptions): DynamicModule {
    return {
      module: AMQPModule,
      imports: [],
      providers: [],
      exports: [],
    };
  }

  public static forFeature(): DynamicModule {
    return {
      module: AMQPModule,
    };
  }

  private static createOptionsProviders(options: AmqpConnectionOptions[]): Provider[] {
    let providers = [];
    options.forEach(option => {
      providers.push(createConnectionOptionsProvider(option));
    });

    return providers;
  }

  private static createConnectionProviders(connections: AmqpConnectionOptions[]): Provider[] {
    let providers = [];
    connections.forEach(connection => {
      providers.push(createConnectionProvider(connection));
    });

    return providers;
  }
}
