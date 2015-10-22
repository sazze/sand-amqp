"use strict";

const EventEmitter = require('events').EventEmitter;

class Context extends EventEmitter {
  constructor(consumer, content, channel, deliveryInfo) {
    super();
    this.consumer = consumer;
    this.body = content;
    this.conn = channel;
    this.meta = deliveryInfo;
  }
}

module.exports = Context;