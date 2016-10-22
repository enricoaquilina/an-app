var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./server/routes/app');
var hubRoutes = require('./server/routes/hub');
var userRoutes = require('./server/routes/user');
var messageRoutes = require('./server/routes/message');

var proxy = httpProxy.createProxyServer();
var app = express();
//this can be changed to accomodate prod vs dev needs
mongoose.connect('localhost:27017/an-app');

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'src');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// We point to our static assets
app.use(express.static(publicPath));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
  next();
})

// We only want to run the workflow when not in production
if (!isProduction) {

  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  var bundle = require('./server/bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
  });
}


app.use('/user', userRoutes);
app.use('/hub', hubRoutes);
app.use('/message', messageRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render({
    message: err.message,
    error: {}
  });
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

// And run the server
app.listen(port, function () {
  console.log('Server running on port ' + port);
});