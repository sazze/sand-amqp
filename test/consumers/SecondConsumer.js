"use strict";

const Consumer = require('../..').Consumer;

class SecondConsumer extends Consumer {
  configure() {
    return {
      exchange: {
        name: 'amq.direct',
        type: 'direct'
      },
      queue: {
        name: 'myname2',
        options: {
          durable: false,
          exclusive: false,
          autoDelete: true
        }
      },
      routingKey: 'myname2'
    }
  }

  *consume(content, channel, message) {
    console.log(message, '2', this.constructor.name);
  }
}

module.exports = SecondConsumer;