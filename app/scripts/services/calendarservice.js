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


        localStorage.events = angular.toJson([]);
        if (localStorage.events) {
            events = angular.fromJson(localStorage.events);
        } else {
            events = [];
        }

        var rejectedEvents;
        if (localStorage.rejectedEvents) {
            rejectedEvents = angular.fromJson(localStorage.rejectedEvents);
        } else {
            rejectedEvents = [];
        }

        var calendarService = {
            events: events,
            rejectedEvents: rejectedEvents,
            addEvent: addEvent,
            rejectEvent: rejectEvent
        };

        return calendarService;

        ////

        function addEvent(event) {
            calendarService.events.push(event);
            localStorage.events = angular.toJson(calendarService.events);
        }

        function rejectEvent(event) {
            calendarService.rejectedEvents.push(event);
            localStorage.rejectedEvents = angular.toJson(calendarService.rejectedEvents);
        }

    });
