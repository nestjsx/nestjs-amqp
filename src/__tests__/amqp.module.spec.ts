import { Test } from '@nestjs/testing';
import AmqpModule from './../amqp.module';
import { ConfigModule } from 'nestjs-config';
import {Injectable, Module} from '@nestjs/common';
import {InjectAmqpConnection} from './../decorators';

describe('Instance amqp module', () => {
  it('Load module with an array of connection', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(),
        AmqpModule.forRoot([
          {
            host: 'amqp://localhost:5672',
          },
          {
            host: 'localhost',
            port: 5672,
            name: 'test',
          },
        ]),
      ],
    }).compile();

    const connection1 = module.get<any>('amqpConnection_0');
    const connectionTest = module.get<any>('amqpConnection_test');

    expect(connection1).toBeTruthy();
    expect(connectionTest).toBeTruthy();

    connection1.close();
    connectionTest.close();
  });

  it('Load module with singular connection', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(),
        AmqpModule.forRoot({
          host: 'amqp://localhost:5672',
        }),
      ],
    }).compile();

    const connection = module.get<any>('amqpConnection_default');

    expect(connection).toBeTruthy();
    connection.close();
  });

  it('Load module using env', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.load(), AmqpModule.forRoot()],
    }).compile();

    const connection = module.get<any>('amqpConnection_default');

    expect(connection).toBeTruthy();
    connection.close();
  });

  it('Load module within an additional module using forFeature', async () => {
    
    @Injectable()
    class Provider {
        constructor(@InjectAmqpConnection() private readonly connection) {}

        hasConnection() {
            return this.connection;
        }

        closeConnection() {
            this.connection.close();
        }
    }

    @Module({
        imports: [AmqpModule.forFeature()],
        providers: [Provider],
    })
    class SubModule {}

    const module = await Test.createTestingModule({
        imports: [
            ConfigModule.load(), 
            AmqpModule.forRoot({
                host: 'amqp://localhost:5672',
            }),
            SubModule,
        ],
    }).compile();
    expect(module.select(SubModule).get<Provider>(Provider).hasConnection()).toBeTruthy();
    module.select(SubModule).get<Provider>(Provider).closeConnection();
  });
});
