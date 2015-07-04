'use strict';

/**
 * @ngdoc service
 * @name datenightApp.calendarService
 * @description
 * # calendarService
 * Factory in the datenightApp.
 */
angular.module('datenightApp')
    .factory('calendarService', function() {

        var events;

         // localStorage.events = angular.toJson([]);
        if (localStorage.events) {
            events = angular.fromJson(localStorage.events);
            _.forEach(events, function(event){
                event.startDate = new Date(event.startDate);
                event.endDate = new Date(event.endDate);
            });
            events = _.reject(events, function(event) {
                var now = (new Date()).getTime();
                var end = event.endDate.getTime();
                return end < now;
            });
        } else {
            events = [];
        }

        var rejectedEvents;
        if (localStorage.rejectedEvents) {
            rejectedEvents = angular.fromJson(localStorage.rejectedEvents);
            _.forEach(events, function(event){
                event.startDate = new Date(event.startDate);
                event.endDate = new Date(event.endDate);
            });
        } else {
            rejectedEvents = [];
        }

        var calendarService = {
            events: events,
            rejectedEvents: rejectedEvents,
            addEvent: addEvent,
            rejectEvent: rejectEvent,
            clearAll: clearAll
        };

        return calendarService;

        ////

        function addEvent(event) {
            calendarService.events.push(event);
            localStorage.events = angular.toJson(calendarService.events);
        }

        function rejectEvent(event) {
            var index = calendarService.events.indexOf(event);
            if(index >= 0) {
                calendarService.events.splice(index, 1);
                localStorage.events = angular.toJson(calendarService.events);
            }

            calendarService.rejectedEvents.push(event);
            localStorage.rejectedEvents = angular.toJson(calendarService.rejectedEvents);
        }

        function clearAll() {
            console.log('clear');
            localStorage.clear();
            calendarService.events = [];
            calendarService.rejectedEvents = [];
            console.log(localStorage);
        }

    });
