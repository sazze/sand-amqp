"use strict";

class Context {
  constructor(consumer, content, channel, deliveryInfo) {
    this.consumer = consumer;
    this.body = content;
    this.conn = channel;
    this.meta = deliveryInfo;
  }
}

module.exports = Context;