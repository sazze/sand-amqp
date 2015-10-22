"use strict";

const sand = require('sand');
const amqp = require('..');
const co = require('co');
let seed = 0;

module.exports = new sand({log: '*'}).use(amqp)
  .start(function() {
    setInterval(function() {
      let id = seed ++;
      global.sand.amqp.publishers.Test.publish('TO TEST   ' + id);
      global.sand.amqp.publishers.Second.publish('TO SECOND ' + id);

      co(function *() {

        let result = yield global.sand.amqp.consumers.RpcClient.send('test.routing.key', 'are you there?', 2000);
        console.log(result);

        let deployMyname1 = yield global.sand.amqp.publisher('deploy', {
          exchange: {
            name: 'amq.direct',
            type: 'direct'
          },
          routingKey: 'myname1'
        });

        let deployMyname2 = yield global.sand.amqp.publisher({
          exchange: {
            name: 'amq.direct',
            type: 'direct'
          },
          routingKey: 'myname1'
        });

        deployMyname2.publish('TO TEST from custom2 ' + id);

        deployMyname1.publish('TO TEST from custom1 ' + id);

      }).catch(console.log);
    }, 1000);
  });