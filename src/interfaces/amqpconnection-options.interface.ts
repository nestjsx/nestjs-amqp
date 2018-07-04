export default interface AmqpConnectionOptions {
	host: string,
	username?: string,
	password?: string,
	ssl?: boolean,
	name?: string,
}