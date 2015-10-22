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

  bindToContext(ctx) {
    ctx.tool = 'skilsaw';
    ctx.on('end', function() {
      console.log('cleaning up context', TestConsumer.name);
    });
  }

  *consume() {
    console.log(this.body, this.tool, TestConsumer.name)
  }
}

module.exports = TestConsumer;