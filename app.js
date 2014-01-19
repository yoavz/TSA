
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var twitter = require('ntwitter');
var sentiment = require('sentiment');

var tweeter = new twitter({
    consumer_key: 'T8i0P5EvZMjLYGEPzXWNw',
    consumer_secret: 'YVcJyLCSwdNVPeQa4VlI9i5vOMqxdn1OvpEEt1yDQw',
    access_token_key: '549040878-VFW3UTEJ0vcw1O0Fm8utT7loGtuqK3e4UQ00chnU',
    access_token_secret: 'Q1Wo91Z5oFG1iKqoqBMC6eeKLHJRibOK0yje31nciTMQ5'
});

/**
 * functions
 */

start = function (req, res) {
    var tweets = [];
    var phrase = req.body.text;
    tweeter.verifyCredentials(function (error, data) {
        if (error) {
            console.log(error);
            res.json([ { user: 'error', body: error }]);
        }

        //stop the stream if it is going
        if (twitter.currentStream) {
            twitter.currentStream.destroy();
            console.log('stopped stream');
        }

        console.log('starting stream on ' + phrase);
        tweeter.stream('statuses/filter', {'track': phrase}, function (stream) {
            stream.on('data', function (data) {
                //only analyze english tweets
                if (data.lang === 'en') {
                    //add sentiment to tweet data
                    sentiment(data.text, function(err, result) {
                        if (err)
                            console.log('sentiment error: '+ err)
                        else {
                            data.sentiment = result.score;
                            io.sockets.emit('tweet', data);
                        }
                    }) 
                }
            })
            twitter.currentStream = stream;
        })

    })
    res.send('starting stream on ' + phrase);
};

stop = function (req, res) {
    if (twitter.currentStream) {
        twitter.currentStream.destroy();
        console.log('stopped stream');
        res.send('stopped stream');
    }
}

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

// Routes
app.get('/', routes.index);

// JSON API
app.post('/api/start', start);
app.post('/api/stop', stop)


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
//io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
