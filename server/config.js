var pkg = require('../package.json');
var path = require('path');
var dotenv = require('dotenv');
dotenv.load();

// Use memory only database if path is not defined or non-production environment

module.exports = exports = {
  version: pkg.version,
  debug: Boolean(process.env.DEBUG || false),
  servername : pkg.name || "untitled server",
  port: process.env.PORT || 8080,
};  