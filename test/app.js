"use strict";

const sand = require('sand');
const amqp = require('..');
let seed = 0;

module.exports = new sand({log: '*'}).use(amqp)
  .start(function() {
    setInterval(function() {
      let id = seed ++;
      global.sand.amqp.publishers.Test.publish('TO TEST   ' + id);
      global.sand.amqp.publishers.Second.publish('TO SECOND ' + id);
    }, 1000);
  });