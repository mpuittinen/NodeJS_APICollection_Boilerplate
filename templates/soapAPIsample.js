/**
 * @api {get} /checkVat : get company info based on VAT
 * @apiName checkVat
 * @apiGroup VAT
 *
 * @apiParam {String} countryCode 2-letter country code (e.g. FI)
 * @apiParam {String} vatNumber vat Code for company (e.g. 123456)
 *
 * @apiSuccess {String} OutputKey 
 */

var express = require('express');
var config = require('../config');
var logger = require('../logger');
var router = express.Router();
var app = "../app";
var Promise = require('bluebird');
var soapReqTpl = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:ec.europa.eu:taxud:vies:services:checkVat:types\"><soapenv:Header/> \
<soapenv:Body> \
 <urn:checkVat> \
  <urn:countryCode>##COUNTRYCODE##</urn:countryCode> \
  <urn:vatNumber>##VATNUMBER##</urn:vatNumber> \
 </urn:checkVat> \
</soapenv:Body> \
</soapenv:Envelope>";

var endpointURL = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService";
var request = require('request');
var dom = require('xmldom').DOMParser;
var xpath = require('xpath'); 
var libxmljs = require("libxmljs");

function handlerequest(req, res) {
  var response = {};
  var vatNumber = req.params.vatNumber || req.query.vatNumber;
  var countryCode = req.params.countryCode || req.query.countryCode;

  if (vatNumber == null) {
    return error(res, "Parameter vatNumber missing");
  }

  if (countryCode == null) {
    return error(res, "Parameter countryCode missing");
  }
  var soapReq = soapReqTpl.replace("##COUNTRYCODE##", countryCode).replace("##VATNUMBER##", vatNumber);
  var resolve = function(body) {
    res.json({"soap" : soapReq});
    return;
  };

  var reject = function(err) {
    error(res,err);
    return;
  }
  var soapheaders = {
    'Content-length' : soapReq.length,
    'Content-Type' : "application/soap+xml; charset=utf-8"
  };

  request.post({ url: endpointURL,
                   headers : soapheaders,
                   body: soapReq }, function(err, resp, body) {
     if (err) {
        error(res, err);
        return;
     }
     try {
         // Simplify things by scrapping NS stuff
         body=body.replace(/xmlns(:[^=]*)?="[^""]*"/g, "");
         console.log(body.replace(/></g, ">\n<"));
         var doc = new dom().parseFromString(body);
         var select = xpath.useNamespaces

         var keys = ['countryCode', 'vatNumber', 'name', 'address'];

         var company = {};
         for (var i in keys) {
            var k=keys[i];
            company[k]=xpath.select("//"+k+"/text()", doc).toString()
         }
         res.json(company);
    } catch(ex) {
        console.log(ex);
        error(res, ex.toString());
    };
  });
}

function error(res, msg) {
    res.json({error: msg});
}
router.get('/', function(req, res) {
  handlerequest(req,res);
});

router.post('/', function(req, res) {
  handlerequest(req,res);
});

module.exports = exports = {
  router: router,
  dailyjob : null, // pointer to function to run daily
  weeklyjob : null, // pointer to function to run weekly
  path : null, // path to endpoint (e.g. companies/getCompany)
};
