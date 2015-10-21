"use strict";

const Consumer = require('./Consumer');
const _ = require('lodash');

class RpcServer extends Consumer {

  *consume(response) {
    let props = this.meta.properties;
    response = this.consumer.constructor.sanitizeMessage(response);
    this.conn.sendToQueue(props.replyTo, response, {
      correlationId: props.correlationId,
    });
  }

  static sanitizeMessage(msg) {

    if (!(msg instanceof Buffer)) {
      if (_.isPlainObject(msg)) {
        msg = JSON.stringify(msg);
      } else {
        msg = msg.toString();
      }
      msg = new Buffer(msg);
    }

    return msg;
  }
}

module.exports = exports = RpcServer;