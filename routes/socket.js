/*
 * Serve content over a socket
 */

var twitter = require('ntwitter');
var sentiment = require('sentiment');
var clients = {};

var twitterConnection = function() {
	return new twitter({
	    consumer_key: 'T8i0P5EvZMjLYGEPzXWNw',
	    consumer_secret: 'YVcJyLCSwdNVPeQa4VlI9i5vOMqxdn1OvpEEt1yDQw',
	    access_token_key: '549040878-VFW3UTEJ0vcw1O0Fm8utT7loGtuqK3e4UQ00chnU',
	    access_token_secret: 'Q1Wo91Z5oFG1iKqoqBMC6eeKLHJRibOK0yje31nciTMQ5'
	});
}

module.exports = function (socket) {
  
  //each socket has it's own tweeter
  var tweeter;
  var streamObject;

  socket.on('get_trends', function (angularId) {
  	if (!tweeter)
  		tweeter = twitterConnection();

  	tweeter.get('trends/1.json', null, function (data) {
  		console.log(data);
  	})
  });

  socket.on('start', function (data) {

  	if (!tweeter)
  		tweeter = twitterConnection();
    
    tweeter.stream('statuses/filter', {'track': data.phrase}, function (stream) {
        stream.on('data', function (data) {
            //only analyze english tweets
            if (data.lang === 'en') {
                //add sentiment to tweet data
                sentiment(data.text, function(err, result) {
                    if (err)
                        console.log('Socket ' + socket.id + ': sentiment error: '+ err)
                    else {
                        data.sentiment = result.score;
                        socket.emit('tweet', data);
                    }
                }) 
            }
        })
        streamObject = stream;
    })
  });

  socket.on('stop', function(data) {
  	if (streamObject) {
  	  streamObject.destroy();
  	  console.log('Socket ' + socket.id + ': stream destroyed');
  	}
  })
};

