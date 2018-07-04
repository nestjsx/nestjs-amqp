Nestjs AMQP
===

An amqp connection service for nestjs.

## Install

## tests

## TODO 

- [x] Manage multiple connections
- [x] Add configuration data
- [x] Add locallaised config via inject or however nestjs prefers 
- [ ] Close connection on termination
- [ ] Retry connection 
- [ ] Make documentation in readme easier to follow


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
    ])],
})
export default class TestModule {
}
```
> Alternatively use the env method `AMQP_URL=amqp://test@test:localhost:5672`

```javascript
import {
    Injectable,
} from '@nestjs/common';
import {
    InjectAmqpConnection,
} from '@bashleigh/nestjs-amqp';

@Injectable()
export default TestService {
    constructor(
        @InjectAmqpConnection('test') private readonly connectionTest, //gets connection with name 'test' defined in module
        @InjectAmqpConnection(1) private readonly connection1, //gets first defined connection without a name
    ) {}
}
```
> Use InjectAmqpConnection without a parameter for default connection

## Future implementation

So far this package manages multiple AMQP connections using the nestjs container and inject them into other providers.  
Alternatively I'd like to implement something like this:

```javascript
import {
    Injectable,
} from '@nestjs/common';
import {
    AmqpConnection,
    Consume,
    Publish,
    Message,
} from '@bashleigh/nestjs-amqp';

@Injectable()
@AmqpConnection()
export default class MyAmqpService {
   
    @Consume("queue_name", {
        noAck: true,
    })
    async listen(@Message message) {
        console.log('Message received', message);
        
        //send a message back
        this.publish();
    }

    @Publish("queue_name")
    async publish() {
        return "Send this to 'queue queue_name'";
    }
}
```

Then using executable context 

```javascript 

import { NestFactory } from '@nestjs/core';
import QueueModule, { MyAmqpService } from './queue';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  const event = app.get(MyAmqpService);

  setInterval(async () => await event.listen(), 500);

}
bootstrap();

process.stdin.resume();
```

Or something similar to the above is what I'd like to implement