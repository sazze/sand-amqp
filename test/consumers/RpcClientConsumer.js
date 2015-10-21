"use strict";

const RpcClient = require('../..').RpcClient;

class RpcClientConsumer extends RpcClient {
  get publisher() {
    let ex = 'test.routing.key';
    return sand.amqp.publisher(ex, {
      exchange: {
        name: ex,
        type: 'direct'
      }
    });
  }
}

module.exports = RpcClientConsumer;