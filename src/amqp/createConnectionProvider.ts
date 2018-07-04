import { AmqpConnectionOptions } from "../interfaces";
import * as amqp from "amqplib";
import resolveAmqpUrl from "./resolveAmqlUrl";

export default function createConnectionProvider(
  counter: number,
  options?: AmqpConnectionOptions
) {
  const url = resolveAmqpUrl(options);
  return {
    provide: `amqpConnection_${options.name ? options.name : counter}`,
    useFactory: async () => await amqp.connect(url)
  };
}
