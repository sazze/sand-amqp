"use strict";

const _ = require('lodash');
const co = require('co');
const bind = require('co-bind');
const amqp = require('sz-amqp');
const callAsPromise = require('./callAsPromise');

const copyMethods = [ 'start', 'stop' ];

class Consumer {

  constructor(baseConfig, spec) {
    let self = this;
    let config = _.merge({}, baseConfig, spec.config);

    this.consumer = new amqp.consumer(config, function() {
      let _args = Array.prototype.slice.call(arguments);
      co(bind.apply(bind, [spec.consume, self].concat(_args))).catch(function(e) {
        sand.error(e.stack);
      });
    });

    callAsPromise(this, this.consumer, copyMethods);
  }

}

module.exports = exports = Consumer;