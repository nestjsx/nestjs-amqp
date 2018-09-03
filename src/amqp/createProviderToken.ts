import { AMQP_PROVIDER } from '../amqp.constants';

export default function createProviderToken(name: string): string {
  return `${AMQP_PROVIDER}_${name}`;
}
