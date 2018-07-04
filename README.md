Nestjs AMQP
===

An amqp connection service for nestjs

## Install

## tests

## TODO 

- [] Manage multiple connections
- [] Add configuration data
- [] Add locallaised config via inject or however nestjs prefers 
- [] Close connection on termination
- [] Retry connection 

```javascript
@module({
    imports: [ConfigModule, AmqpModule.forRoot([
        {
            host: 'amqp://test:test@localhost',
        }, 
        {
            username: 'test',
            password: 'test',
            host: 'localhost',
            ssl: true,
            name: 'test',
        }
    ]), TestService],
})
export default class TestModule {

}
```

```javascript
@Injectable()
export default TestService {
    constructor(@InjectAmqpConnection('test') private readonly connection) {}
}
```