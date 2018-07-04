import { Module, DynamicModule, Global } from "@nestjs/common";
import ConfigModule from "@bashleigh/nest-config";
import { AmqpConnectionOptions } from "./interfaces";
import {
  AmqpConnection,
  createConnectionProvider,
} from './amqp';

@Global()
@Module({
  imports: [ConfigModule]
})
export default class AMQPModule {
  static forRoot(options?: AmqpConnectionOptions[] | AmqpConnectionOptions): DynamicModule {
    const connections = [];
    const providers = [];
    if (options instanceof Array) {
      connections.concat(options);
    } else if (options) {
      connections.concat([options]);
    } else {
      providers.push(AmqpConnection);
    }
    if (connections.length > 0) 
      connections.map((ops, key) => providers.push(createConnectionProvider(key, ops)));

    return {
      module: AMQPModule,
      providers: providers,
      exports: providers,
    }
  }
}
