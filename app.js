
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: true });
var twitter = require('ntwitter');
var sentiment = require('sentiment');

var tweeter = new twitter({
    consumer_key: 'T8i0P5EvZMjLYGEPzXWNw',
    consumer_secret: 'YVcJyLCSwdNVPeQa4VlI9i5vOMqxdn1OvpEEt1yDQw',
    access_token_key: '549040878-VFW3UTEJ0vcw1O0Fm8utT7loGtuqK3e4UQ00chnU',
    access_token_secret: 'Q1Wo91Z5oFG1iKqoqBMC6eeKLHJRibOK0yje31nciTMQ5'
});

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
}; 

// redirect all routes to same page
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
