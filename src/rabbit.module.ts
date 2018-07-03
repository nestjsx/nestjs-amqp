import {
    Module,
} from '@nestjs/common';
import RabbitMQService from './rabbitmq.service';
import ConfigModule from '@bashleigh/nest-config/dist';

@Module({
    imports: [ConfigModule],
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export default class RabbitMQModule {}