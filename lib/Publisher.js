"use strict";

const _ = require('lodash');
const amqp = require('sz-amqp');
const copyMethods = ['connect', 'close', 'publish', 'handleError'];
const Q = require('q');

class Publisher {

  constructor(baseConfig, config) {
    if (!config) {
      config = this.configure();
    }
    config = _.extend({}, baseConfig, config);
    this.publisher = new amqp.publisher(config);
  }

  configure() {
    return {

    }
  }

}

for (let method of copyMethods) {
  Publisher.prototype[method] = function() {
    return Q.nfapply(this.publisher[method].bind(this.publisher), arguments);
  };
}

module.exports = exports = Publisher;