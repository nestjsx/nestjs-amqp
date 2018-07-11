import * as amqp from 'amqplib';
import { ConfigService } from 'nestjs-config';

const DefaultConnection = {
  provide: 'amqpConnection_default',
  useFactory: async (config: ConfigService) => {
    //TODO add configservice here
    return await amqp.connect();
  },
  inject: [ConfigService],
};
export default DefaultConnection;
