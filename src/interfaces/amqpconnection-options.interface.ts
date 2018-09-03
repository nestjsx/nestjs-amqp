export interface AmqpConnectionOptions {
  host: string;
  port?: number;
  username?: string;
  password?: string;
  ssl?: boolean;
  name?: string;
}

export interface AmqpConnectionAsyncOptions {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<AmqpConnectionOptions|AmqpConnectionAsyncOptions[]>;
}
