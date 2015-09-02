"use strict";

const SandGrain = require('sand-grain');
const amqp = require('sz-amqp');
const _ = require('lodash');
const path = require('path');
const Publisher = require('./Publisher');
const Consumer = require('./Consumer');
const co = require('co');
const Q = require('q');
const fs = require('fs');
const EventsD = require('sz-eventsd');

class Amqp extends SandGrain {

  constructor() {
    super();
    this.name = this.configName = 'amqp';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  init(config, done) {
    let self = this;
    super.init(config);

    co(function *() {

      let consumerDir = path.join(sand.appPath, self.config.consumerDir);

      try {

        yield Q.nfcall(fs.access, consumerDir, fs.F_OK);

        self.consumers = require('require-all')({
          dirname: consumerDir,
          filter: /(\w+)Consumer\.js$/,
          resolve: function (Consumer) {

            return new Consumer(self.config);
          }
        });

        for (let name in self.consumers) {
          yield self.consumers[name].start();
        }

      } catch (e) {
        if ('ENOENT' == e.code) {
          self.log('Skipping consumers');

        } else {
          throw e;
        }
      }


      let publisherDir = path.join(sand.appPath, self.config.publisherDir);

      try {

        yield Q.nfcall(fs.access, publisherDir, fs.F_OK);

        self.pubs = self.publishers = require('require-all')({
          dirname: publisherDir,
          filter: /(\w+)Publisher\.js$/,
          resolve: function(spec) {
            if (_.isPlainObject(spec)) {
              return new Publisher(self.config, spec)
            } else {
              return new spec(self.config);
            }
          }
        });

        for (let name in self.publishers) {
          yield self.publishers[name].connect();
        }

      } catch (e) {
        if ('ENOENT' == e.code) {
          self.log('Skipping publishers');

        } else {
          throw e;
        }
      }


      done();
    }).catch(function(e) {
      sand.error(e.stack);
    });

  }

  shutdown(done) {
    let self = this;
    co(function *() {

      for (let name in self.consumers) {
        yield self.consumers[name].stop();
      }

      for (let name in self.publishers) {
        yield self.publishers[name].close();
      }

      if (_.isPlainObject(self.customPublishers)) {
        for (let name in self.customPublishers) {
          yield self.customPublishers[name].close();
        }
      }

      done();

    }).catch(function(e) {
      sand.error(e.stack);
    });
  }

  publisher(name, config) {
    let self = this;
    return co(function *() {
      if (!self.customPublishers) {
        self.customPublishers = {};
      }
      if (!self.customPublishers[name]) {
        self.customPublishers[name] = new Publisher(self.config, config);
        yield self.customPublishers[name].connect();
      }
      return self.customPublishers[name];
    });
  }

  routingKey(event, app, env) {
    if (!this._applications) {
      if (_.isFunction(this.config.applications)) {
        this._applications = this.config.applications() || {};
      } else {
        this._applications = {};
      }
    }
    app = this._applications[app || 'default'] || process.env.SZ_APP_NAME || 'unknown';
    env = env || sand.env;
    return new EventsD({environment: env, appName: app}).getRoutingKey(event)
  }

}

module.exports = exports = Amqp;
exports.Consumer = require('./Consumer');
exports.Publisher = require('./Publisher');