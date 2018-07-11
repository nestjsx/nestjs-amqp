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
            host: "amqp://localhost:5672"
          },
          {
            host: "localhost",
            port: 5672,
            name: "test"
          }
        ])
      ]
    }).compile();

    const connection1 = module.get<any>("amqpConnection_0");
    const connectionTest = module.get<any>("amqpConnection_test");

    expect(connection1).toBeTruthy();
    expect(connectionTest).toBeTruthy();
  });

  it("Load module with singular connection", async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(),
        AmqpModule.forRoot({
          host: "amqp://localhost:5672"
        })
      ]
    }).compile();

    const connection = module.get<any>("amqpConnection_default");

    expect(connection).toBeTruthy();
  });

  it("Load module using env", async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.load(), AmqpModule.forRoot()]
    }).compile();

    const connection = module.get<any>("amqpConnection_default");

    expect(connection).toBeTruthy();
  });
});
