import * as amqp from 'amqplib';
import resolveAmqpUrl from './resolveAmqlUrl';

const DefaultConnection = {
  provide: 'amqpConnection_default',
  useFactory: async (config) => {
    return await amqp.connect(resolveAmqpUrl(config));
  },
  inject: ['AmqpConfigProvider'],
};
export default DefaultConnection;
