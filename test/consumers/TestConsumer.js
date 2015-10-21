"use strict";

const Consumer = require('../..').Consumer;

/**
 * Example of a simple queue consumer handler
 */
class TestConsumer extends Consumer {
  configure() {
    return {
      exchange: {
        name: 'amq.direct',
        type: 'direct'
      },
      queue: {
        name: 'myname1',
        options: {
          durable: false,
          exclusive: false,
          autoDelete: true
        }
      },
      routingKey: 'myname1'
    }
  }

  *consume() {
    console.log(this.body, TestConsumer.name)
  }
}

module.exports = TestConsumer;