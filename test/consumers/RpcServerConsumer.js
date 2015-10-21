"use strict";

const RpcServer = require('../..').RpcServer;

class RpcServerConsumer extends RpcServer {

  configure() {
    super.configure();

    let ex = 'test.routing.key';
    return {
      exchange: {
        name: ex,
        type: 'direct'
      },
      queue: {
        //name: rk,
        options: {
          durable: false,
          exclusive: false,
          autoDelete: true,
        }
      },
      routingKey: ex
    }
  }

  *consume() {
    console.log(RpcServerConsumer.name, this.body);
    yield super.consume("i'm here!");
  }
}

module.exports = RpcServerConsumer;