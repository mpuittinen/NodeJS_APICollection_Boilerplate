// Services handling module
// Usage:
//   app = express();
//   svcs = require("services") 
//   app = svcs.init(app) # registers all modules in "services/"
// 


var scheduler = require('node-schedule');
var dailyschedule = "0 8 * * *"; // 8 AM
var weeklyschedule = "0 8 * * 1"; // Monday, 8AM

var services = {
    init :function (app, logger) {
        var fs = require("fs");
        var files = fs.readdirSync("server/services");

        for (var file in files) {
            var module = files[file].replace(".js", "");
            app = registerService(app, module, logger);
        }
        return app;
    }
}

// Load and register a hander under defined path (defaults to module name)
var registerService = function(app, moduleName, logger) {
  var mod = require('./services/' + moduleName);
  // Register the daily jobs
  if (mod.dailyJob) {
    var j = scheduler.scheduleJob(dailyschedule, mod.dailyJob);
  }
  // Register the weekly jobs
  if (mod.weeklyJob) {
    var j = scheduler.scheduleJob(weeklyschedule, mod.weeklyJob);
  }
  var endpoint = mod.path || moduleName;
  app.use('/' + (mod.path || moduleName),
    mod.router || mod
  );
  logger.info("Registered /" + endpoint + " from " + moduleName + ".js");
  return app;
};

exports = module.exports = services;