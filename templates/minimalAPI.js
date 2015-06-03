/**
 * @api {get} /apiendpoint API endpoint address
 * @apiName apiName (e.g. createAccount)
 * @apiGroup apiGroup (e.g. Accounts)
 *
 * @apiParam {String} Paramname (input)
 *
 * @apiSuccess {String} OutputKey 
 */

var express = require('express');
var config = require('../config');
var logger = require('../logger');
var router = express.Router();
var app = "../app";
var Promise = require('bluebird');
  
function handlerequest(req, res) {
  var response = {};
  res.json(response);
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
