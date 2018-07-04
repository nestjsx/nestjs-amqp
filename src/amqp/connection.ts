import * as amqp from "amqplib";
import { ConfigService } from "@bashleigh/nest-config";

const amqpConnection = {
  provide: "amqpConnection",
  useFactory: async (config: ConfigService) =>
    await amqp.connect(config.has("AMQP_URL") ? config.get("AMQP_URL") : null),
  inject: ["ConfigService"]
};
export default amqpConnection;
