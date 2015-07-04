'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:CalendarCtrl
 * @description
 * # CalendarCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('CalendarCtrl', function($scope, calendarService) {

        // $scope.events = calendarService.events;

        $scope.events = _.groupBy(calendarService.events, function(event) {

        	var startDate = getDateFromDateTime(event.startDate);
        	return startDate.getTime();
        });

        function getDateFromDateTime(dateTime) {
        	return new Date(dateTime.getFullYear() +'-'+  (dateTime.getMonth() + 1) + '-' + dateTime.getDate());
        }
        

    });
