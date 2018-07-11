import { Inject } from '@nestjs/common';

const InjectAmqpConnection = (
  connectionName: string = 'amqpConnection_default',
) => Inject(connectionName);

export default InjectAmqpConnection;
