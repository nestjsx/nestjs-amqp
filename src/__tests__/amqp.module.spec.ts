import { Test } from '@nestjs/testing';
import AmqpModule from './../amqp.module';
import { ConfigModule } from 'nestjs-config';
import { Injectable, Module } from '@nestjs/common';
import { InjectAmqpConnection } from './../decorators';
var ChannelModel = require('amqplib/lib/channel_model').ChannelModel;
import * as path from 'path';

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

    expect(connection1).toBeInstanceOf(ChannelModel);
    expect(connectionTest).toBeInstanceOf(ChannelModel);

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

    expect(connection).toBeInstanceOf(ChannelModel);
    connection.close();
  });

  it('Load module using env', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '__stubs__', 'config', '**/*.ts'),
          { path: path.resolve(__dirname, '__stubs__', '.env') },
        ),
        AmqpModule.forRoot(),
      ],
    }).compile();

    const connection = module.get<any>('amqpConnection_default');

    expect(connection).toBeInstanceOf(ChannelModel);
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
    expect(
      module
        .select(SubModule)
        .get<Provider>(Provider)
        .hasConnection(),
    ).toBeInstanceOf(ChannelModel);
    module
      .select(SubModule)
      .get<Provider>(Provider)
      .closeConnection();
  });
});
