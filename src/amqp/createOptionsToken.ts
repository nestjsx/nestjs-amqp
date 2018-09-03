import { AMQP_CONNECTION_OPTIONS } from './../amqp.constants';

export default function createOptionsToken(name: string): string {
  return `${AMQP_CONNECTION_OPTIONS}_${name}`;
}
