import { Injectable } from "@nestjs/common";
import { InjectAmqpConnection } from "./amqp";

@Injectable()
export default class RabbitMQService {
  constructor(@InjectAmqpConnection() amqp) {
		
  }
}
