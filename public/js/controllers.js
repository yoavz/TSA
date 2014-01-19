'use strict';

function RGBToHex(r,g,b){
    var bin = r << 16 | g << 8 | b;
    return (function(h){
        return new Array(7-h.length).join("0")+h
    })(bin.toString(16).toUpperCase())
}

function rating_to_hex_color(rating) {
  if (rating < -5 || rating > 5)
    rating = 0;

  var b = 0;  
  var r = (255 * rating) / 10;
  var g = (255 * (10-rating)) / 10;

  return RGBToHex(r, g, b);
}

/* Controllers */

angular.module('twitter.controllers', []).
  controller('MainController', function ($scope, $http, socket) {
  
  var time = new Date().getTime() / 1000; 
  var start = new Date().getTime() / 1000;

  $scope.inputData = {};
  $scope.displayTweets = [{created_at: 'time',
            text: 'Hello World!',
            user: {
              screen_name: 'broav',
              profile_image_url: 'https://pbs.twimg.com/profile_images/344513261565453503/146e141cca48e4c1cbab00dd72adbff9_bigger.jpeg'
            },
            style: { class: 'panel-info'}}];
  $scope.tweetCount = 0;
  $scope.totalSentiment = 0;
  $scope.averageSentiment = 0;
  $scope.sentimentColor = '000000';
  $scope.tps = 0;
  $scope.plotData = [[1, 2], [2, 3], [3, 4]];


  //var socket = io.connect('http://localhost:3001');

  socket.on('tweet', function (data) {
    //calculate sentiment
    $scope.tweetCount++;
    $scope.totalSentiment += data.sentiment;
    $scope.averageSentiment = $scope.totalSentiment / $scope.tweetCount ;
    $scope.tps = $scope.tweetCount / ( (new Date().getTime() / 1000) - start);

    // $scope.sentimentColor = function() {
    //   var rating = data.sentiment;

    //   if (rating < -5 || rating > 5)
    //     rating = 0;

    //   var b = 0;  
    //   var r = (255 * rating) / 10;
    //   var g = (255 * (10-rating)) / 10;

    //   var sColor = '#' + RGBToHex(r, g, b);
    //   return { color: sColor + ' !important;'};
    // } 

    //if it has been two seconds since the last tweet, display it
    var currentTime = new Date().getTime() / 1000;
    if ((currentTime - time) > 2) {
      time = currentTime;

      // panel_class
      if (data.sentiment > 1)
        data.panel_class = "panel-success";
      else if (data.sentiment < -1)
        data.panel_class = "panel-danger";
      else
        data.panel_class = "panel-warning";

      $scope.displayTweets.unshift(data);
    }
  })

  //grab the most recent tweets
  $scope.start = function() {
    $scope.tweetCount = 0;
    $scope.totalSentiment = 0;
    $scope.averageSentiment = 0;

    $http.post('/api/start', $scope.inputData)
      .success(function(data) {
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.stop = function() {
    $http.post('/api/stop')
      .success(function (data) {
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }
});
