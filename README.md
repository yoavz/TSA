![Go Bruins!](http://i.imgur.com/bzniPwy.png)

## TSA - Twitter Sentiment Analysis

Type in any phrase you would like to get a live stream of tweets and a visualization of their sentiment.
Uses Express, AngularJS, and socket.IO to plug into the twitter streaming api. The sentiment analysis is
done through the [sentiment](https://npmjs.org/package/sentiment) node package, which uses the 
[AFINN-111](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) wordlist to analyze arbitrary
blocks of text, (in our case tweets).

One extra note - if hosted on a server, this webapp will not be able to serve multiple clients. This is due
to Twitter's restriction to serve only one streaming connection per API and blocking that streaming connection
to a maximum of 1% of all tweets.

### Running the app

clone the repository

Add in twitter API keys and access tokens in app.js

```shell
npm install
node app.js
```

## Contact

by [Yoav Zimmerman](http://yoavz.com) 

For more information on AngularJS please check out http://angularjs.org/
For more on Express and Jade, http://expressjs.com/ and http://jade-lang.com/ are
your friends.
