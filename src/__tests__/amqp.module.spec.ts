import { Test } from "@nestjs/testing";
import AmqpModule from "./../amqp.module";
import { ConfigModule } from "nestjs-config";

describe("Instance amqp module", () => {
  it("Load module with an array of connection", async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(),
        AmqpModule.forRoot([
          {
            host: "amqp://localhost:15672"
          },
          {
            host: "localhost",
            port: 15672,
            name: "test"
          }
        ])
      ]
    }).compile();

    const connection1 = module.get("AmqpConnection_1");
    const connectionTest = module.get("AmqpConnection_test");

    console.log("connection", connection1, connectionTest);
  });

  it("Load module with singular connection", async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(),
        AmqpModule.forRoot({
          host: "amqp://localhost:15672"
        })
      ]
    }).compile();

    const connection = module.get("AmqpConnection_default");

    console.log("connection", connection);
  });

  it("Load module using env", async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.load(), AmqpModule.forRoot()]
    }).compile();

    const connection = module.get("AmqpConnection_default");

    console.log("connection", connection);
  });
});
