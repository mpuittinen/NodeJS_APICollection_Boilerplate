var path = require('path'),
		util = require('util'),
		del = require('del'),
		gulp = require('gulp'),
		localtunnel = require('localtunnel'),
		dotenv = require('dotenv'),
		exec = require('exec-wait'),
		Promise = require('bluebird'),
		$ = require('gulp-load-plugins')(),
		runSequence = require('run-sequence'),
		eventStream = require('event-stream'),
                gulpNSP = require('gulp-nsp'),
		package = require('./package.json');



/* Configurations. Note that most of the configuration is stored in
the task context. These are mainly for repeating configuration items */
dotenv.load();
var config = {
		version: package.version,
		port: process.env.PORT || 8080,
		debug: Boolean($.util.env.debug),
		production: Boolean($.util.env.production) || (process.env.NODE_ENV === 'production')
	},
	// Global vars used across the test tasks
	ghostDriver, testServer;


/* Bump version number for package.json */
// TODO Provide means for appending a patch id based on git commit id or md5 hash
gulp.task('bump', function() {
	// Fetch whether we're bumping major, minor or patch; default to minor
	var env = $.util.env,
			type = (env.major) ? 'major' : (env.patch) ? 'patch' : 'minor';

	gulp.src(['./package.json'])
		.pipe($.bump({ type: type }))
		.pipe(gulp.dest('./'));
});

/* Serve the web site */
gulp.task('serve', $.serve({
	root: 'server/',
	port: config.port
}));

gulp.task('lint', function() {
	return gulp.src(['server/services/*.js', 'server/{index|app|config|logger}.js'])
		.pipe($.cached('jslint'))
		.pipe($.using())
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'));
});

gulp.task('start-tunnel', function() {
	var tunnel = localtunnel(config.port, { subdomain: 'sc5apicollection' }, function(err, tunnel) {
		if (err) {
			$.util.log(err);
		}
		if (tunnel) {
			$.util.log('Opened tunnel at:', tunnel.url);
		}
	});

	tunnel.on('close', function() {
		$.util.log('Closed local tunnel');
	});
});

// Generate/build documentation
gulp.task('doc', $.apidoc.exec({
	src: "server/",
	dest: "dist/doc/",
	debug: Boolean($.util.env.debug),
	includeFilters: [ '.*\\.js$' ]
}));


gulp.task('test-setup', function(cb) {
	// Test database slackbot.test.db is used in a case of NODE_ENV=test
	process.env.NODE_ENV = 'test';

	var cmdAndArgs = package.scripts.start.split(/\s/),
			cmdPath = path.dirname(require.resolve('phantomjs')),
			cmd = path.resolve(cmdPath, require(path.join(cmdPath, 'location')).location);

	ghostDriver = exec({
		name: 'Ghostdriver',
		cmd: cmd,
		args: ['--webdriver=4444', '--ignore-ssl-errors=true'],
		monitor: { stdout: 'GhostDriver - Main - running on port 4444' },
		log: $.util.log
	});

	testServer = exec({
		name: 'Test server',
		cmd: cmdAndArgs[0] + (process.platform === 'win32' ? '.cmd' : ''),
		args: ['server/index.js', '--mock-slack'],
		monitor: { url: 'http://localhost:' + config.port + '/', checkHTTPResponse: false },
		log: $.util.log,
		stopSignal: 'SIGTERM'
	});

	return testServer.start()
		.then(ghostDriver.start)
		.then(function() {
			// Hookup to keyboard interrupts, so that we will
			// execute teardown prior to exiting
			process.once('SIGINT', function() {
				return ghostDriver.stop()
					.then(testServer.stop)
					.then(function() {
						process.exit();
					})
			});
			return Promise.resolve();
		});
})

gulp.task('test-run', function() {
	process.env.NODE_ENV = 'test';

	var Promise = require('bluebird');
	$.util.log('Running tests (protractor)');

	return new Promise(function(resolve, reject) {
		gulp.src(['tests/*.js'])
		.pipe($.plumber())
		.pipe($.protractor.protractor({
			configFile: 'protractor.config.js',
			args: ['--seleniumAddress', 'http://localhost:4444/wd/hub',
						 '--baseUrl', url]
		}))
		.on('end', function() {
			resolve();
		})
		.on('error', function() {
			resolve();
		})
	});
});

gulp.task('test-teardown', function() {
	return ghostDriver.stop()
		.then(testServer.stop);
});

//To check your package.json
gulp.task('test-nsp', function (cb) {
	gulpNSP('./package.json', cb);
});

gulp.task('build', function() {
	return runSequence(['lint','doc']);
});

// NOTE: Running also build to avoid running against old code
gulp.task('test-full', ['build'], function() {
	return runSequence('test-setup', 'test-nsp', 'test-run', 'test-teardown');
});

// NOTE: Running also build to avoid running against old code
gulp.task('test', ['build'], function() {
	return runSequence('test-setup', 'test-run', 'test-teardown');
});

gulp.task('default', ['build', 'test']);
