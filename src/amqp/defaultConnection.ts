import * as amqp from "amqplib";
import { ConfigService } from "nestjs-config";

const DefaultConnection = {
  provide: "amqpConnection_default",
  useFactory: async (config: ConfigService) =>
    await amqp.connect(config.has("amqp.host") ? config.get("amqp.host") : null),
  inject: [ConfigService]
};
export default DefaultConnection;
