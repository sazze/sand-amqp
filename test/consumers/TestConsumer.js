"use strict";

const Consumer = require('../..').Consumer;

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

  *consume(content, channel, message) {
    console.log(message, '1');
  }
}

module.exports = TestConsumer;