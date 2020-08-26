<p align="center"><img src="https://avatars1.githubusercontent.com/u/43827489?s=400&u=45ac0ac47d40b6d8f277c96bdf00244c10508aef&v=4"/></p>
<p align="center">
    <a href="https://travis-ci.org/nestjsx/nestjs-amqp"><img src="https://travis-ci.org/nestjsx/nestjs-amqp.svg?branch=master"/></a>
    <a href="https://www.npmjs.com/package/nestjs-amqp"><img src="https://img.shields.io/npm/v/nestjs-amqp.svg"/></a>
    <a href="https://github.com/nestjsx/nestjs-amqp/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nestjsx/nestjs-amqp.svg"/></a>
    <a href="https://coveralls.io/github/nestjsx/nestjs-amqp?branch=master"><img src="https://coveralls.io/repos/github/nestjsx/nestjs-amqp/badge.svg?branch=master"/></a>
    <img src="https://flat.badgen.net/dependabot/nestjsx/nestjs-config?icon=dependabot" />
    <img src="https://camo.githubusercontent.com/a34cfbf37ba6848362bf2bee0f3915c2e38b1cc1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5052732d77656c636f6d652d627269676874677265656e2e7376673f7374796c653d666c61742d737175617265" />
    <a href="https://github.com/juliandavidmr/awesome-nestjs#components--libraries"><img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/awesome-nest.svg?sanitize=true" alt="Awesome Nest" /></a>
    <a href="https://github.com/nestjs/nest"><img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/nest-powered.svg?sanitize=true" alt="Nest Powered" /></a>
</p>
<h1 align="center">Nestjs Amqp</h1>

<p align="center">An AMQP connection service for <a href="https://github.com/nestjs/nest">NestJS</a>.</p>

<p>Using the <a href="https://github.com/squaremo/amqp.node">AMQPlib</a> for node package.</p>

This package was intented to be used in execution content and provides a basic AMQPlib connection via the providers to allow developers to develop their amqp queue consumers and publishers. For microservice transport; check out <a href="https://docs.nestjs.com/microservices/rabbitmq">the docs</a> for rabbitMQ.

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
export default class AppModule {}

```

### Usage with nestjs-config

```ts
import {Module} from '@nestjs/common';
import {AmqpModule} from 'nestjs-amqp';
import {ConfigModule, ConfigService} from 'nestjs-config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/*.ts')),
    AmqpModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('amqp'),
      inject: [ConfigService],
    }),
  ],
})
export default class AppModule {}

//src/config/amqp.ts
export default {
  name: 'rabbitmq',
  hostname: process.env.AMQP_HOST,
  port: process.env.AMQP_PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
} 
```
> Unfortunately multiple connections are unavailable when using the `forRootAsync` method.

## Connection Decorators

```ts
import {Module} from '@nestjs/common';
import {AmqpModule} from 'nestjs-amqp';

@Module({
  imports: [AmqpModule.forRoot([
    {
      hostname: 'test:test@localhost',
    }, 
    {
      username: 'test',
      password: 'test',
      hostname: 'localhost',
      port: 5672,
      protocol: 'amqps',
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
export default class TestService {
  constructor(
    @InjectAmqpConnection('test') private readonly connectionTest, //gets connection with name 'test' defined in module
    @InjectAmqpConnection(0) private readonly connection0, //gets first defined connection without a name
  ) {}
}
```
> Use InjectAmqpConnection without a parameter for default connection

### Example publish 

```ts
import {Injectable, Logger} from '@nestjs/common';
import {InjectAmqpConnection} from 'nestjs-amqp';

@Injectable()
export default class TestProvider {
  constructor(@InjectAmqpConnection() private readonly amqp) {}
  async publish(message: string)  {
    await this.amqp.createChannel((err, channel) => {
      if (err != null) {
        Logger.alert(err, 'TestProvider');
      }
      channel.assertQueue('test_queue_name');
      channel.sendToQueue('test_queue_name', message);
    });
  }
}
```
More information and examples about amqplib can be found [here](https://www.npmjs.com/package/amqplib).

## Available Options

Name | For | Default
--- | --- | ---
hostname | The host url for the connection | `localhost`
port | The port of the amqp host | `5672`
name | The name of the connection | `default` or the array key index `[0]`
retries | The amount of retry attempts before surrender | 3
retryDelay | The amount of milliseconds to wait before attempting retry | 3000
protocol | The protocol for the connection | `amqp`
username | The username for the connection | 
password | The password for the connection |
locale | The desired locale for error messages | `en_US`
frameMax | The size in bytes of the maximum frame allowed over the connection | 0
heartbeat | The period of the connection heartbeat in seconds | 0
vhost | What VHost shall be used | `/`

## Testing this package

In order to test first you need to start the rabbitmq container. We've provided a `docker-compose` file to make this easier.

```bash
$ docker-compose up -d 
$ yarn test
```
> Navigate to localhost:15672 for rabbitmq manager, username and password are both `guest`

> If you're using docker-machine or a VM then change the env for `HOST` in the `.env` file or create one using the provided `.env.dist` file.

## Future implementation

> WARNING: The below examples have not been implemented 

So far this package manages multiple AMQP connections using the nestjs container and injects them into other providers.  
Alternatively I'd like to implement something like this:

```ts
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

```ts 

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
