"use strict";

module.exports = {
  config: {
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
  },

  consume: function *(content, channel, message) {
    console.log(message, '2');
  }
};