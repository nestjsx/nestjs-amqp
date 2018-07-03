import { Module } from '@nestjs/common';
import RabbitMQService from "./rabbitmq.service";
import ConfigModule from "@bashleigh/nest-config";
import AmqpConnection from './amqp';

@Module({
  imports: [ConfigModule],
  providers: [AmqpConnection, RabbitMQService],
  exports: [RabbitMQService]
})
export default class RabbitMQModule {}
