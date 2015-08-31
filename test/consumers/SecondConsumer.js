"use strict";

const Consumer = require('../..').Consumer;

/**
 * Example of a simple queue consumer handler
 */
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
    console.log(content, this.constructor.name)
  }
}

module.exports = SecondConsumer;