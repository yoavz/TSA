/*
 * Serve JSON to our AngularJS client
 */

exports.start = function (req, res) {
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
        tweeter.get('trends/current', null, function(data) {
            console.log(data);
        })

    })
    res.send('starting stream on ' + phrase);
};

exports.stop = function (req, res) {
    if (twitter.currentStream) {
        twitter.currentStream.destroy();
        console.log('stopped stream');
    }
}