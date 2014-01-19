'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('twitter', [
  'twitter.controllers',
  'twitter.filters',
  'twitter.services',
  'twitter.directives',

  'ngRoute',
  'ngAnimate',
  
  // 3rd party dependencies
  'btford.socket-io',
  'linkify'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'index',
      controller: 'MainController'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
