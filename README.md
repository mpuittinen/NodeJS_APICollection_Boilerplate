# SC5 APIcollection Boilerplate

The API Colleciton boilerplate is a modifiable boilerplate for fast development of APIs / light backends:
* 
* Spaces instead of tabs

## Installation

### Prerequisites

Clone the project and trigger installation of the project dependencies by

    > git clone https://github.com/mpuittinen/SC5_APICollection_Boilerplate.git
    > npm install
    > npm run deps

## Building

Not Applicable

### Debug and Release builds

    > npm install --debug       # to force development dependencies
    > npm start                 # to trigger bower install, build and tests

## Running

### Running the Server

To start the server, use one of the following:

    > npm start                 # to start the server through npm
    > node server               # to start the server

The server should respond your http requests on local port 8080.

### Running with Docker

Boilerplate also comes with Docker support. To have a minimal Docker image and
speed up the containerization, the whole app is built before the packaging, and
only the Node.js production dependencies get packaged. To build and run the
container, run:

    > docker build -t APIcollection . # to build the Docker image with name "APIcollection"
    > docker run -d -P APIcollection # to star the app

To access the service, check the dynamically allocated port
(for example: 0.0.0.0:49164->8080/tcp) and use it in browser URL

    > docker ps                 # --> http://localhost:49164/

Localhost works in Linux environment, but if you are using boot2docker, you need to use VM IP
instead. Check the IP and replace `localhost` with it:

    > boot2docker ip
    # --> http://192.168.59.103:49164/



##  Extending & Hacking

###  Project Layout

#### Server

    server/index.js                Minimal express.js based server
    server/app.js                  The server framework, registers the service endpoints
    server/logger.js               Logging facilities
    server/config.js               Configuration file (incl interface / port configs)
    server/services                Directory that contain the services (these are automatically
                                   registered by app.js)
    server/services/sampleAPI.js   Minimal sample service implementation 


## Testing

Tests are defined in the tests directory. By default the following file is included:

    tests/testSampleAPI.js               
TBD

## TODO

Update Readme to match the implementation

## Release History

* 2015/06/02 - v0.1.0 - Initial commit (partially working stub)


## License

Copyright (c) 2015 [SC5](http://sc5.io/), licensed for users and contributors under MIT license.
https://github.com/sc5/grunt-bobrsass-boilerplate/blob/master/LICENSE-MIT


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/SC5/gulp-bobrsass-boilerplate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
