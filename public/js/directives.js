'use strict';

/* Directives */

angular.module('twitter.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('chart', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {

        	var chart = null,
        		options = {
        			series: {
        				shadowSize: 0 //Drawing is faster w/o shadows
        			},
        			yaxis: {
        				min: -5,
        				max: 5
        			},
        			xaxis: {
        				show: false
        			},
        		};

        	var data = scope[attrs.ngModel];

        	scope.$watch('data', function (v) {
        		if (!chart) {
        			if (typeof v !== 'undefined' && v.length > 0) {
        				chart = $.plot(elem, v, options);
        				elem.show();
        			}
        		}
        		else {
        			chart.setData(v);
        			chart.setupGrid();
        			chart.draw();
        		}
        	});
        }
    };
  }]);
