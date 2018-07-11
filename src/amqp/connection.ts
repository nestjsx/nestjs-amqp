import * as amqp from "amqplib";
import { ConfigService } from "nestjs-config";

const amqpConnection = {
  provide: "amqpConnection_default",
  useFactory: async (config: ConfigService) =>
    await amqp.connect(config.has("AMQP_URL") ? config.get("AMQP_URL") : null),
  inject: ["ConfigService"]
};
export default amqpConnection;
