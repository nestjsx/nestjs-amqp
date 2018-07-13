import * as amqp from 'amqplib';
import { ConfigService } from 'nestjs-config';

const DefaultConnection = {
  provide: 'amqpConnection_default',
  useFactory: async (config: ConfigService) => {
    return await amqp.connect(config.get('amqp.host'));
  },
  inject: [ConfigService],
};
export default DefaultConnection;
