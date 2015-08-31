"use strict";
module.exports = {

  all: {
    vhost: '/myvhost',
    user: 'myuser',
    password: 'mypass',
    applications: function() {
      return {
        default: require('../package').name
      }
    }
  }

};