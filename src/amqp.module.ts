import { Module, DynamicModule, Global } from "@nestjs/common";
import { InjectConfig } from "nestjs-config";
import { AmqpConnectionOptions } from "./interfaces";
import { AmqpConnection, createConnectionProvider } from "./amqp";
import * as path from 'path';

@Global()
@Module({
  imports: []
})
export default class AMQPModule {

  constructor(@InjectConfig() private readonly config) {}

  async configure() {
    await this.config.merge(path.join(__dirname, '**/*.config.{ts,js}'));
  }

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
        providers.push(createConnectionProvider("default", connections[0]));
      } else {
        connections.map((ops, key) =>
          providers.push(createConnectionProvider(key, ops))
        );
      }
    }

    return {
      module: AMQPModule,
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
