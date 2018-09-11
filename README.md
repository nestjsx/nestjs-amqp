<p align="center"><img src="https://avatars1.githubusercontent.com/u/41109786?s=200&v=4"/></p>
<p align="center">
    <a href="https://travis-ci.org/nestjs-community/nestjs-amqp"><img src="https://travis-ci.org/nestjs-community/nestjs-amqp.svg?branch=master"/></a>
    <a href="https://www.npmjs.com/package/nestjs-amqp"><img src="https://img.shields.io/npm/v/nestjs-amqp.svg"/></a>
    <a href="https://github.com/nestjs-community/nestjs-amqp/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nestjs-community/nestjs-amqp.svg"/></a>
    <a href="https://coveralls.io/github/nestjs-community/nestjs-amqp?branch=master"><img src="https://coveralls.io/repos/github/nestjs-community/nestjs-amqp/badge.svg?branch=master"/></a>
</p>


<p align="center">An AMQP connection service for <a href="">NestJS</a>.</p>

<p>Using the <a href="https://github.com/squaremo/amqp.node">AMQPlib</a> for node package.</p>

## Install

```bash
$ yarn add nestjs-amqp
```

## Basic usage 

```ts
import {Module} from '@nestjs/common';
import {AmqpModule} from 'nestjs-amqp';

@Module({
  imports: [AmqpModule.forRoot({
    name: 'rabbitmq',
    hostname: 'localhost',
    port: 5672,
    username: 'test',
    password: 'test',
  })],
})
export default AppModule {}

```

<!-- ### Usage with nestjs-config

```ts
import {Module} from '@nestjs/common';
import {AmqpModule} from 'nestjs-amqp';
import {ConfigModule, ConfigService} from 'nestjs-config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/*.ts')),
    AmqpModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('aqmp'),
      inject: [ConfigService],
    }),
  ],
})
export default AppModule {}

//src/config/amqp.ts
export default {
  name: 'rabbitmq',
  hostname: process.env.AMQP_HOST,
  port: process.env.AMQP_PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
} 

//alternatively you can use an array 
export default [
  {
    name: 'rabbitmq',
    hostname: process.env.AMQP_HOST,
    port: process.env.AMQP_PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  {
    name: 'other_connection',
    hostname: process.env.ANOTHER_CONNECTION,
    port: process.env.ANOTHER_PORT,
  },
]; 
``` -->

## tests
In order to test first you need to start the rabbitmq container. We've provided a `docker-compose` file to make this easier.

```bash
$ docker-compose up -d 
$ yarn test
```
> Navigate to localhost:15672 for rabbitmq manager, username and password are both `guest`

```ts
import {Module} from '@nestjs/common';
import {AmqpModule} from 'nestjs-amqp';

@module({
  imports: [AmqpModule.forRoot([
    {
      host: 'amqp://test:test@localhost',
    }, 
    {
      username: 'test',
      password: 'test',
      hostname: 'localhost',
      port: 5672,
      ssl: true,
      name: 'test',
    }
  ])],
})
export default class ExecutionModule {
}
```

```ts
import {Injectable} from '@nestjs/common';
import {InjectAmqpConnection} from 'nestjs-amqp';

@Injectable()
export default TestService {
  constructor(
    @InjectAmqpConnection('test') private readonly connectionTest, //gets connection with name 'test' defined in module
    @InjectAmqpConnection(0) private readonly connection0, //gets first defined connection without a name
  ) {}
}
```
> Use InjectAmqpConnection without a parameter for default connection

## Future implementation

So far this package manages multiple AMQP connections using the nestjs container and inject them into other providers.  
Alternatively I'd like to implement something like this:

```javascript
import {Injectable} from '@nestjs/common';
import {
  AmqpConnection,
  Consume,
  Publish,
  Message,
} from 'nestjs-amqp';

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

  await event.listen();

}
bootstrap();

process.stdin.resume();
```

Or something similar to the above is what I'd like to implement
