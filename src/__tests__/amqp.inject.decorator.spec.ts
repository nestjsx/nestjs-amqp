import {Test, TestingModule} from '@nestjs/testing';
import {Injectable} from '@nestjs/common';
import AmqpModule from '../amqp.module';
import { InjectAmqpConnection } from '../decorators';
const ChannelModel = require('amqplib/lib/channel_model').ChannelModel;

describe('InjectAmqpConnection', () => {
  it('Connection should inject', async () => {

    @Injectable()
    class TestProvider {
      constructor(@InjectAmqpConnection() private readonly connection) {}

      hasConnection() {
        return this.connection;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AmqpModule.forRoot({
          host: 'localhost',
        }),
      ],
      providers: [TestProvider],
    }).compile();

    const provider = module.get(TestProvider);

    expect(provider.hasConnection()).toBeInstanceOf(ChannelModel);
  });
});