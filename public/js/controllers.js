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
  controller('MainController', function ($scope, $http, socket, $timeout) {
  
  var time, start;

  $scope.inputData = {};
  $scope.displayTweets = [{created_at: 'time',
            text: 'Hello World!',
            user: {
              screen_name: 'broav',
              profile_image_url: 'https://pbs.twimg.com/profile_images/344513261565453503/146e141cca48e4c1cbab00dd72adbff9_bigger.jpeg'
            },
            style: { class: 'panel-info'}}];

  $scope.phrase = "";
  $scope.tweetCount = 0;
  $scope.totalSentiment = 0;
  $scope.averageSentiment = 0;
  $scope.sentimentColor = '000000';
  $scope.tps = 0;
  $scope.disableButtons = false;

  $scope.plotCounter = 0;
  $scope.plotData = [[0, 5]];

  socket.on('tweet', function (data) {
    var currentTime = new Date().getTime() / 1000.0;

    $scope.disableButtons = false;

    //calculate sentiment
    $scope.tweetCount++;
    $scope.totalSentiment += data.sentiment;
    $scope.averageSentiment = $scope.totalSentiment / $scope.tweetCount ;
    $scope.tps = $scope.tweetCount / ( currentTime - start);

    //add to graph data
    $scope.plotCounter++;
    if ($scope.plotData.length > 30) {
      $scope.plotData.shift();
    }
    $scope.plotData.push([$scope.plotCounter, $scope.averageSentiment]);

    //if it has been two seconds since the last tweet, display it
    if ((currentTime - time) > 2) {
      time = currentTime;

      // panel_class
      if (data.sentiment > 6)
        data.panel_class = "panel-success";
      else if (data.sentiment < 4)
        data.panel_class = "panel-danger";
      else
        data.panel_class = "panel-warning";

      $scope.displayTweets.unshift(data);
    }
  })

  //grab the most recent tweets
  $scope.start = function() {
    var input = $scope.inputData.text.trim();
    if (input.length > 0) {
      start = new Date().getTime() / 1000.0;
      time = new Date().getTime() / 1000.0;

      $scope.disableButtons = true;

      //reset stats
      $scope.tweetCount = 0;
      $scope.totalSentiment = 0;
      $scope.averageSentiment = 0;

      //reset graphs data
      $scope.plotData = [[0, 5]];
      $scope.plotCounter = 0;

      socket.emit('start', {phrase: input});
      $scope.phrase = input;
    } else {
      alert('invalid phrase');
    }
  };

  $scope.stop = function() {
    socket.emit('stop', null);
    $scope.disableButtons = false;
  }

  $scope.init = function() {
    socket.emit('get_trends', null); 
    console.log('init')
  }
});
