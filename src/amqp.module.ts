import { Module, DynamicModule } from "@nestjs/common";
import { ConfigModule } from "nestjs-config";
import { AmqpConnectionOptions } from "./interfaces";
import { DefaultConnection, createConnectionProvider } from "./amqp";

@Module({})
export default class AMQPModule {
  static forRoot(
    options?: AmqpConnectionOptions[] | AmqpConnectionOptions
  ) {
    let connections = [];
    const providers = [];

    if (options instanceof Array) {
      connections = connections.concat(options);
    } else if (options) {
      connections.push(options);
    } else {
      providers.push(DefaultConnection);
    }

    if (connections.length > 0) {
      if (connections.length === 1) {
        providers.push(createConnectionProvider("default", connections[0]));
      } else {
        connections.map((ops, key) =>
          providers.push(createConnectionProvider(key, ops))
        );
      }
    }

    return {
      module: AMQPModule,
      imports: [ConfigModule.load()],
      providers: providers,
      exports: providers,
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: AMQPModule,
    };
  }
}
