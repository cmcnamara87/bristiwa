'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:EventdetailsCtrl
 * @description
 * # EventdetailsCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('EventDetailsCtrl', function($scope, $stateParams, calendarService) {

    	$scope.event = _.find(calendarService.events, function(event) {
    		return event.title === $stateParams.eventTitle;
    	});
    	console.log($scope.event);
    });
