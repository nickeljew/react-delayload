(function (){
    "use strict";

    var express = require('express')
    var path = require('path')
    //var bodyParser = require('body-parser')
    var swig  = require('swig')


    var app = express()

    //app.use(bodyParser.json()); // for parsing application/json
    //app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.use('/favicon.ico', function (req, res, next) {
        res.end('')
    })
    app.use( express.static( path.join(__dirname, 'res') ) )

    app.engine('html', swig.renderFile)
    app.set('view engine', 'html')
    app.set('views', __dirname )


    //app.use('/', require('./routes/index')(express))

    app.get('/', function(req, res, next) {
        res.render('test')
    })
    app.get('/dom', function(req, res, next) {
        res.render('test-dom')
    })


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found')
        err.status = 404
        next(err)
    })



    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
            .json({
            success: false,
            message: err.message,
            error: {}
        })
    })


    module.exports = app



    var http = require('http')
        , port = 3000
    app.set('port', port)

    /**
     * Create HTTP server.
     */
    var server = http.createServer(app)

    server.listen(port, function() {
       //
    });
    server.on('error', onError);
    server.on('listening', onListening);


    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.error('Listening on ' + bind);
    }


})();
