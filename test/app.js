"use strict";

const sand = require('sand');
const amqp = require('..');

module.exports = new sand({log: '*'}).use(amqp)
  .start(function() {
    setInterval(function() {
      global.sand.amqp.publishers.Test.publish('test');
      console.log(global.sand.amqp.routingKey('deploy'));
      console.log(amqp.routingKey('deploy'));
    }, 2000);
  });