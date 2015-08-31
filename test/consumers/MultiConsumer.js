"use strict";

const Consumer = require('../..').Consumer;

/**
 * This is an example of a single consumer handler that may bind to multiple 'routing keys'/configs
 */
class MultiConsumer extends Consumer {

  configure() {
    return [
      {
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
      },
      {
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
    ]
  }

  *consume(content, channel, message) {
    console.log(content, this.constructor.name)
  }

}

module.exports = MultiConsumer;