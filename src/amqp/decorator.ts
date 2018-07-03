import {
    Inject,
} from '@nestjs/common';

export default () => Inject('amqpConnection');