import { Test, TestingModule } from '@nestjs/testing';
import { AmqpModule } from './../index';
import { createConnectionToken } from '../utils/create.tokens';
import { Module } from '@nestjs/common';
const ChannelModel = require('amqplib/lib/channel_model').ChannelModel;
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { InjectAmqpConnection } from '../decorators';

describe('AmqpModule', () => {
  it('Instace Amqp', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot({
          hostname: process.env.HOST,
          retrys: 1,
        }),
      ],
    }).compile();

    const amqpModule = module.get(AmqpModule);

    expect(amqpModule).toBeInstanceOf(AmqpModule);

    module.get(createConnectionToken('default')).close();
  });

  it('Instace Amqp Connection provider', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot({
          hostname: process.env.HOST,
          retrys: 1,
        }),
      ],
    }).compile();

    const amqpConnection = module.get(createConnectionToken('default'));

    expect(amqpConnection).toBeInstanceOf(ChannelModel);

    amqpConnection.close();
  });

  it('Multiple connection options', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot([
          {
            hostname: process.env.HOST,
            name: 'test',
            retrys: 1,
          },
          {
            hostname: process.env.HOST,
            retrys: 1,
          },
        ]),
      ],
    }).compile();

    const amqpConnectionTest = module.get(createConnectionToken('test'));
    const amqpConnection1 = module.get(createConnectionToken('1'));

    expect(amqpConnectionTest).toBeInstanceOf(ChannelModel);
    expect(amqpConnection1).toBeInstanceOf(ChannelModel);

    amqpConnection1.close();
    amqpConnectionTest.close();
  });

  it('Connection options', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot({
          hostname: process.env.HOST,
          name: 'test',
          port: 5673,
          username: 'user',
          password: 'pass',
          retrys: 1,
        }),
      ],
    }).compile();

    const amqpConnectionTest = module.get(createConnectionToken('test'));

    expect(amqpConnectionTest).toBeInstanceOf(ChannelModel);

    amqpConnectionTest.close();
  });

  it('Connection available in submodule', async () => {
    @Module({
      imports: [AmqpModule.forFeature()],
    })
    class SubModule {}

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot({
          hostname: process.env.HOST,
          retrys: 1,
        }),
        SubModule,
      ],
    }).compile();

    const provider = module
      .select<SubModule>(SubModule)
      .get(createConnectionToken('default'));

    expect(provider).toBeInstanceOf(ChannelModel);

    provider.close();
  });

  it('Connections should build with AmqpAsyncOptionsInterface', async () => {
    class TestProvider {
      constructor(@InjectAmqpConnection() private readonly amqp) {}

      getAmqp() {
        return this.amqp;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '__stubs__', 'config', '*.ts'),
        ),
        AmqpModule.forRootAsync({
          useFactory: async config => config.get('amqp'),
          inject: [ConfigService],
        }),
      ],
      providers: [TestProvider],
    }).compile();

    const provider = module.get(TestProvider);

    expect(provider.getAmqp()).toBeInstanceOf(ChannelModel);

    provider.getAmqp().close();
  });
});
