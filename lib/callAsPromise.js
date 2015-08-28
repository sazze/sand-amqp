"use strict";

const _ = require('lodash');
const Q = require('q');

module.exports = function(self, target, methods) {
  if (!_.isArray(methods)) {
    methods = [methods];
  }

  for (let method of methods) {
    self[method] = function() {
      let _args = Array.prototype.slice.call(arguments);
      return Q.nfapply(target[method].bind(target), _args);
    }
  }
};