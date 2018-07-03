import {
    Injectable,
} from '@nestjs/common';
import {
    ConfigService,
} from '@bashleigh/nest-config';
import * as amqp from 'amqplib';

@Injectable()
export default class RabbitMQService 
{
    connection;
    constructor(private readonly config: ConfigService)
    {}
}