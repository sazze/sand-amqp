"use strict";

const _ = require('lodash');
const amqp = require('sz-amqp');
const callAsPromise = require('./callAsPromise');
const copyMethods = ['connect', 'close', 'publish', 'handleError'];

class Publisher {

  constructor(baseConfig, config) {
    if (!config) {
      config = this.configure();
    }
    config = _.extend({}, baseConfig, config);
    this.publisher = new amqp.publisher(config);
    callAsPromise(this, this.publisher, copyMethods);
  }

  configure() {
    return {

    }
  }

}

module.exports = exports = Publisher;