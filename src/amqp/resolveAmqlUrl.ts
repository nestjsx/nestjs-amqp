import { AmqpConnectionOptions } from "./../interfaces";

export default function resolveAmqpUrl(options: AmqpConnectionOptions): string {
  if (Object.keys(options).length === 1) return options.host;
  let url =
    (options.hasOwnProperty("ssl") && options.ssl ? "amqps" : "amqp") + "://";
  if (options.hasOwnProperty("username")) url += options.username;
  if (options.hasOwnProperty("password")) url += `:${options.password}@`;
  url += options.host;
  return url;
}
