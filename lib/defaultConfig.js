"use strict";

module.exports = {
  vhost: '/guest',
  user: 'guest',
  password: 'guest',
  port: 5672,
  host: '127.0.0.1',

  consumerDir: '/consumers',
  publisherDir: '/publishers',

  applications: function() {
    return {
      default: ''
    }
  },
};