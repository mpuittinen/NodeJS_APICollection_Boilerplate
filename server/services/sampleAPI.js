var express = require('express');
var config = require('../config');
var logger = require('../logger');
var router = express.Router();
var app = "../app";
var Promise = require('bluebird');
  
function handlerequest(req, res) {
  var now = new Date();
  res.json({message: "Hello from Sample"});
}

router.get('/', function(req, res) {
  handlerequest(req,res);
});

router.post('/', function(req, res) {
  handlerequest(req,res);
});

module.exports = exports = {
  router: router
};
