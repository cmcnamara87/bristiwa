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

        $scope.calendarService = calendarService;

        $scope.events = _.groupBy(calendarService.events, function(event) {
            var startDate = getDateFromDateTime(event.startDate);
            return startDate.getTime();
        });


        function getDateFromDateTime(dateTime) {
            var date = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
            return date;
        }

        $scope.remove = function(date, title) {
            var index = _.findIndex($scope.events[date], {
                title: title
            });
            console.log(index);

            calendarService.rejectEvent($scope.events[date][index]);
            $scope.events[date].splice(index, 1);
        }

    });
