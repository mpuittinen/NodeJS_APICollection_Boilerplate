var Promise = require('bluebird');
var _ = require('lodash');
var request = require('request');
var app = require("../server/app");
var serviceURL = 'http://' + app.config.serviceUsername + ':' + app.config.servicePassword 
      + '@localhost:' + app.config.port + '/sampleAPI';

/**
 * Register pullups via REST API. Returns promise containing the response body
 * If response if JSON, it gets parsed, thus promise returns an Object
 * @param  {Integer} count   How many pullups
 * @param  {Object} userData Optional
 * @return {Object}          String or object
 */
var getGreeting = function() {
  return new Promise(function(resolve, reject) {
    request.get(serviceURL, function(err, resp, body) {
      console.log(body);
      if (err) {
        return reject(err);
      }
      // If response is JSON, parse it
      if (resp.headers['content-type'].match(/json/)) {
        return resolve(JSON.parse(body));
      }

      reject("Wrong content type" + body);
    });
  });
};

describe('sampleAPI', function() {
  // This is how Slack sends email addresses
  it('Says hello', function(done) {
    getGreeting()
    .then(function(response) {
      // Tenders are returned
      expect(response.message).toMatch("Hello from Sample");
      done();
    })
    .catch(function(err) {
      throw err;
    });
  });
});


