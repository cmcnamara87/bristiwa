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
        debugger;

        function getDateFromDateTime(dateTime) {
            return new Date(dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate());
        }

        function parseDate(timestamp) {
            var splitDate = timestamp.split(/[^0-9]/);
            return new Date(splitDate[0], splitDate[1] - 1, splitDate[2], splitDate[3], splitDate[4], splitDate[5]);
        }

    });
