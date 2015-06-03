var path = require('path');
var pkg = require('../package.json');
var _ = require('lodash');
var bunyan = require('bunyan');
var dotenv = require('dotenv');
dotenv.load();

var isProduction = (process.env.NODE_ENV && process.env.NODE_ENV === 'production') ? true : false;
var servername = pkg.name || 'server';
var serverversion = pkg.version || '';
if (serverversion != '') {
	servername = servername + " v" + serverversion;
}

module.exports = exports = bunyan.createLogger({
  name: servername,
  streams: [{
    stream: process.stdout
  }, {
    type: 'rotating-file',
    path: path.join(__dirname, '../server.log'),
    period: '1d',
    count: 3
  }]
});;