import { ConfigService } from 'nestjs-config';
import * as path from 'path';

export default {
    provide: 'AmqpConfigProvider',
    useFactory: async (config) => {
        await config.merge(path.resolve(__dirname, 'config', 'amqp.ts'));
        return config.get('amqp');
    },
    inject: [ConfigService],
};