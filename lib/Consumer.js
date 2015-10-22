"use strict";

const _ = require('lodash');
const co = require('co');
const Q = require('q');
const bind = require('co-bind');
const amqp = require('sz-amqp');
const domain = require('domain');

const Context = require('./Context');

class Consumer {

  constructor(baseConfig) {
    let config = this.configure();

    if (!_.isArray(config)) {
      this.consumer = this.newConsumer(baseConfig, config);

    } else {
      for (let i in config) {
        let consumer = this.newConsumer(baseConfig, config[i]);
        config[i] = consumer;
      }
      this.consumers = config;
    }

  }

  newConsumer(baseConfig, config) {
    let self = this;
    config = _.merge({}, baseConfig, config);
    return new amqp.consumer(config, function() {
      let _args = Array.prototype.slice.call(arguments);
      co(bind.apply(bind, [self._consume, self].concat(_args))).catch(self.onError.bind(self));
    });
  }

  start() {
    let self = this;
    return co(function *() {
      if (!self.consumers) {
        yield startConsumer(self.consumer);
      } else {
        for (let consumer of self.consumers) {
          yield startConsumer(consumer);
        }
      }

      return self;
    });

    function startConsumer(consumer) {
      return Q.nfcall(consumer.start.bind(consumer));
    }
  }

  stop() {
    let self = this;
    return co(function *() {
      if (!self.consumers) {
        yield stopConsumer(self.consumer);

      } else {
        for (let consumer of self.consumers) {
          yield stopConsumer(consumer);
        }
      }

      return self;
    });

    function stopConsumer(consumer) {
      return Q.nfcall(consumer.stop.bind(consumer));
    }
  }

  configure() {
    return {

    }
  }

  bindToContext(ctx) {

  }

  onError(e) {
    sand.error(e.stack || e);
  }

  *_consume(content, channel, message) {
    let self = this;

    let consumeDomain = domain.create();
    let ctx = consumeDomain.context = new Context(this, content, channel, message);

    if (this.consumer) {
      consumeDomain.add(this.consumer)
    } else if (this.consumers && _.isArray(this.consumers)) {
      for (let c of this.consumers) {
        consumeDomain.add(c);
      }
    }

    this.bindToContext(ctx);
    consumeDomain.on('error', onError);
    consumeDomain.run(function() {
      ctx.emit('begin');
      co(bind(self.consume, ctx))
          .catch(onError)
          .then(function() {
            ctx.emit('end');
          });
    });

    function onError(e) {
      self.onError(e);
      ctx.emit('end');
    }
  }

  *consume() {

  }
}

module.exports = exports = Consumer;