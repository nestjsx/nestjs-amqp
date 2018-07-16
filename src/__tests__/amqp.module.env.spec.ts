import { Test } from '@nestjs/testing';
import AmqpModule from './../amqp.module';
import { ConfigModule } from 'nestjs-config';
var ChannelModel = require('amqplib/lib/channel_model').ChannelModel;
import * as path from 'path';

describe('Instance amqp module with envs', () => {
    it('Load module using env', async () => {
        const module = await Test.createTestingModule({
          imports: [
            ConfigModule.load(
              '',
              { path: path.resolve(__dirname, '__stubs__', '.env') },
            ),
            AmqpModule.forRoot(),
          ],
        }).compile();
    
        const connection = module.get<any>('amqpConnection_default');
    
        expect(connection).toBeInstanceOf(ChannelModel);
        connection.close();
      });
    
      it('Load module using env expanded array', async () => {
        const module = await Test.createTestingModule({
          imports: [
            ConfigModule.load(
              '',
              { path: path.resolve(__dirname, '__stubs__', '.envarray') },
            ),
            AmqpModule.forRoot(),
          ],
        }).compile();
    
        const connection = module.get<any>('amqpConnection_default');
    
        expect(connection).toBeInstanceOf(ChannelModel);
        connection.close();
      });
});