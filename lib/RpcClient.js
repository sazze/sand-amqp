"use strict";

const crypto = require('crypto');
const _ = require('lodash');
const co = require('co');
const Consumer = require('./Consumer');
const Publisher = require('./Publisher');

class RpcClient extends Consumer {

  configure() {
    this.routingKey = sand.amqp.routingKey('rpc-' + this.constructor.uid());

    return {
      queue: {
        name: this.routingKey,
        options: {
          durable: false,
          exclusive: false,
          autoDelete: true
        }
      },
      exchange: {
        name: 'amq.direct',
        type: 'direct'
      },
      routingKey: this.routingKey
    }
  }

  *consume() {
    let self = this.consumer;
    let msg = this.body;
    let delivery = this.meta;
    if (self.callbacks[delivery.properties.correlationId]) {
      self.callbacks[delivery.properties.correlationId](null, msg);
    }
  }

  get publisher() {
    return null;
  }

  send(routingKey, msg, ttl, callback) {
    let self = this;
    return co(function *() {

      if (_.isFunction(ttl)) {
        callback = ttl;
        ttl = undefined;
      }

      if (!ttl) {
        ttl = 5000;
      }

      if (_.isUndefined(msg)) {
        msg = {};
      }

      if (!self.callbacks) {
        self.callbacks = {};
      }

      let timeout;
      let correlationId = self.constructor.uid();
      let _callback = callback;

      let publisher = self.publisher;

      if (publisher instanceof Promise) {
        publisher = yield publisher;
      }

      return yield new Promise(function (resolve, reject) {

        callback = _.once(function(err, data) {
          clearTimeout(timeout);
          delete self.callbacks[correlationId];
          if (_.isFunction(_callback)) {
            _callback(err, data);
          }
          if (err) {
            reject(err);
          } else {
            if (_.isString(data) && data.charAt(0) == '{') {
              try {
                data = JSON.parse(data);
              } catch(e) {
                sand.log(e.stack);
              }
            }
            resolve(data);
          }
        });

        self.callbacks[correlationId] = callback;

        timeout = setTimeout(function() {
          callback(new Error('Remote call timed out. Exceeded ' + ttl + 'ms.'));
        }, ttl);

        let options = {
          replyTo: self.routingKey,
          correlationId: correlationId,
        };

        publisher.publish(msg, options, routingKey);

      });

    });
  }

  static uid() {
    return crypto.randomBytes(24).toString('base64')
  }

}

module.exports = RpcClient;