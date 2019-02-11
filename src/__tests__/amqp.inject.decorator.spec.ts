import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { AmqpModule } from './../index';
import { InjectAmqpConnection } from '../decorators';
const ChannelModel = require('amqplib/lib/channel_model').ChannelModel;

describe('InjectAmqpConnection', () => {
  it('Connection should inject', async () => {
    @Injectable()
    class TestProvider {
      constructor(@InjectAmqpConnection() private readonly connection) {}

      getConnection() {
        return this.connection;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot({
          hostname: process.env.HOST,
          retrys: 1,
        }),
      ],
      providers: [TestProvider],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const provider = module.get(TestProvider);

    expect(provider.getConnection()).toBeInstanceOf(ChannelModel);
    await app.close();
  });

  it('Connection should inject with name', async () => {
    @Injectable()
    class TestProvider {
      constructor(
        @InjectAmqpConnection('1') private readonly connection,
        @InjectAmqpConnection('0') private readonly connection0,
      ) {}

      getConnection() {
        return this.connection;
      }

      getConnection0() {
        return this.connection0;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot([
          {
            hostname: process.env.HOST,
            retrys: 1,
          },
          {
            hostname: process.env.HOST,
            retrys: 1,
          },
        ]),
      ],
      providers: [TestProvider],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const provider = module.get(TestProvider);

    expect(provider.getConnection()).toBeInstanceOf(ChannelModel);
    expect(provider.getConnection0()).toBeInstanceOf(ChannelModel);
    await app.close();
  });
});
