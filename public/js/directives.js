'use strict';

/* Directives */

angular.module('twitter.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('chart', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

        	var chart = null,
        		options = {
        			series: {
        				lines: {
                            lineWidth: 3,
                            fill: true,
                        }
        			},
        			yaxis: {
        				min: 0,
        				max: 10,
        			},
        			xaxis: {

        				show: false
        			},
        		};

        	scope.$watchCollection(attrs.ngModel, function (v) {
        		if (!chart) {
                    chart = $.plot(elem, [v], options);
                    elem.show();                       
        		}
        		else {
        			chart.setData([v]);
        			chart.setupGrid();
        			chart.draw();
        		}
        	});
        }
    };
  });
