import { Module, DynamicModule, Global } from "@nestjs/common";
import ConfigModule from "@bashleigh/nest-config";
import { AmqpConnectionOptions } from "./interfaces";
import { AmqpConnection, createConnectionProvider } from "./amqp";

@Global()
@Module({
  imports: [ConfigModule]
})
export default class AMQPModule {
  static forRoot(
    options?: AmqpConnectionOptions[] | AmqpConnectionOptions
  ): DynamicModule {
    let connections = [];
    const providers = [];

    if (options instanceof Array) {
      connections = connections.concat(options);
    } else if (options) {
      connections.push(options);
    } else {
      providers.push(AmqpConnection);
    }

    if (connections.length > 0) {
      if (connections.length === 1) {
        providers.push(createConnectionProvider('default', options));
      } else {
        connections.map((ops, key) =>
          providers.push(createConnectionProvider(key, ops))
        );
      }
    }

    return {
      module: AMQPModule,
      providers: providers,
      exports: providers
    };
  }
}
