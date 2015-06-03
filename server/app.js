var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var config = require('./config');
var logger = require('./logger');
var cors = require('cors');
var services = require('./services');

// Read variables from environment (easy for development)
var app = express();

app.logger = logger;
app.log = logger.info;
app.config = config;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Enable CORS for cross site scripting (access API from )
app.use(cors());

app = services.init(app, logger);

// Host documentation
app.use('/doc',
  express.static('server/doc')
);

/**
 * Default response
 *
 * @api {get} / Default handler
 * @apiName getDefault
 * @apiGroup default
 * @apiVersion 0.1.0
 */
app.use('/', function(req, res) {
  res.send('Hello from ' + config.servername + " " + config.version + '!');
});

exports = module.exports = app;
