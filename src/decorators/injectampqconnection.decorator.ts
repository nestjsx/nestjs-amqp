import { Inject } from '@nestjs/common';
import createProviderToken from '../amqp/createProviderToken';

export default function InjectAmqpConnection(
  connectionName: string = 'default',
){ 
  return Inject(createProviderToken(connectionName));
}
