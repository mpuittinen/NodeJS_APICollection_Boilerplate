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
    init :function (app) {
        var fs = require("fs");
        var files = fs.readDirSync("./services");
        for (var file in files) {
            app = registerService(app, file);
        }
    }
}

// Load and register a hander under defined path (defaults to module name)
var registerService = function(app, moduleName) {
  var mod = require('./services/' + moduleName);
  // Register the daily jobs
  if (mod.dailyJob) {
    var j = scheduler.scheduleJob(dailyschedule, mod.dailyJob);
  }
  // Register the weekly jobs
  if (mod.weeklyJob) {
    var j = scheduler.scheduleJob(weeklyschedule, mod.weeklyJob);
  }

  app.use('/' + (mod.path || moduleName),
    passport.authenticate('basic', { session: false }),
    mod.router || mod
  );
  return app;
};

exports = module.exports = services;