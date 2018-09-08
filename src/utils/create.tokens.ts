import {
  AMQP_CONNECTION_PROVIDER,
  AMQP_OPTIONS_PROVIDER,
} from '../amqp.constants';

export function createOptionsToken(name: string): string {
  return `${AMQP_OPTIONS_PROVIDER}_${name}`;
}

export function createConnectionToken(name: string): string {
  return `${AMQP_CONNECTION_PROVIDER}_${name}`;
}
