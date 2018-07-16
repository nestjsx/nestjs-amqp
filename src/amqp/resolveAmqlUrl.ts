import { AmqpConnectionOptions } from './../interfaces';

export default function resolveAmqpUrl(options: AmqpConnectionOptions): string {
  //TODO start of string condition

  if (Object.keys(options).length === 1) return options.host;
  let url =
    (options.hasOwnProperty('ssl') && options.ssl ? 'amqps' : 'amqp') + '://';

  if (options.hasOwnProperty('username')) url += options.username;
  if (options.hasOwnProperty('password')) url += `:${options.password}`;
  if (options.hasOwnProperty('username') || options.hasOwnProperty('password'))
    url += '@';
  url += options.host;
  if (options.hasOwnProperty('port')) url += `:${options.port}`;
  return url;
}
