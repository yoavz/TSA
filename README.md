# Angular Socket.io Seed

Start an awesome app with AngularJS on the front, Socket.io + Express + Node on the back. This
project is an application skeleton for writing [AngularJS](http://angularjs.org/) apps that use
web sockets to add real-time functionality. If you're not planning on using web sockets, you
should consider the [Angular Express Seed](https://github.com/btford/angular-express-seed) instead.

The seed contains angular libraries, test libraries and a bunch of scripts all preconfigured for
instant web development gratification. Just clone the repo (or download the zip/tarball) and
you're ready to develop your application.

The seed app shows how to wire together Angular client-side components with Socket.io and Express
on the server. It also illustrates writing angular partials/views with the Jade templating library.

_Note: Although Jade supports interpolation, you should be doing that mostly on the client. Mixing
server and browser templating will convolute your app. Instead, use Jade as a syntactic sugar for
HTML, and let AngularJS take care of interpolation on the browser side._

## TSA - Twitter Sentiment Analysis

Type in any phrase you would like to get a live stream of tweets and a visualization of their sentiment.
Uses Express, AngularJS, and socket.IO to plug into the twitter streaming api. The sentiment analysis is
done through the [sentiment](https://npmjs.org/package/sentiment) node package, which uses the 
[AFINN-111](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) wordlist to analyze arbitrary
blocks of text, (in our case tweets).

### Running the app

clone the repository

```shell
npm install
node app.js
```

## Contact

by [Yoav Zimmerman](http://yoavz.com) 
For more information on AngularJS please check out http://angularjs.org/
For more on Express and Jade, http://expressjs.com/ and http://jade-lang.com/ are
your friends.
