
var _ = require('lodash');
var Promise = require('bluebird');
var logger = require('./logger');
var config = require('./config');

// Only then load app
var app = require('./app');

// List of promises to wait until server can be started
var initQueue = [];

logger.info('Starting ' + config.servername + ' server at: 0.0.0.0:' + config.port);

Promise.all(initQueue)
.then(function() {
  logger.info('Started.');
  app.listen(config.port);
})
.catch(function(err) {
  logger.error(err, 'Failed');
});
