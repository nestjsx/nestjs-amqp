export default interface AmqpOptionsInterface {
  host: string;
  name?: string;
  port?: number;
  username?: string;
  password?: string;
  ssl?: boolean;
}