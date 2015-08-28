"use strict";

module.exports = {
  config: {
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

  consume: function *(content, channel, message) {
    console.log(message, '1');
  }
};