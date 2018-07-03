import * as amqp from 'amqplib';
import { ConfigService } from '@bashleigh/nest-config';

const amqpConnection = [
    {
        provide: 'amqpConnection',
        useFactory: async (config: ConfigService) => await amqp.connect(),
        inject: ['ConfigService'],
    }
];
export default amqpConnection;