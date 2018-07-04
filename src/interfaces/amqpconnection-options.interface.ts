export default interface AmqpConnectionOptions {
  host: string;
  port?: number;
  username?: string;
  password?: string;
  ssl?: boolean;
  name?: string;
}
