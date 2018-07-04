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
import {
    Module,
} from '@nestjs/common';
import ConfigModule from '@bashleigh/nest-config';

@module({
    imports: [ConfigModule, AmqpModule.forRoot([
        {
            host: 'amqp://test:test@localhost',
        }, 
        {
            username: 'test',
            password: 'test',
            host: 'localhost',
            port: 5672,
            ssl: true,
            name: 'test',
        }
    ]), TestService],
})
export default class TestModule {
}
```
> Alternatively use the env method `AMQP_URL=amqp://test@test:localhost:5672`

```javascript
@Injectable()
export default TestService {
    constructor(
        @InjectAmqpConnection('test') private readonly connectionTest, //gets connection with name 'test' defined in module
        @InjectAmqpConnection(1) private readonly connection1, //gets first defined connection without a name
    ) {}
}
```
> Use InjectAmqpConnection without a parameter for default connection