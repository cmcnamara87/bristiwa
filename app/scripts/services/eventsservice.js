'use strict';

/**
 * @ngdoc service
 * @name datenightApp.eventsService
 * @description
 * # eventsService
 * Factory in the datenightApp.
 */
angular.module('datenightApp')
    .factory('eventsService', function(calendarService, $rootScope) {
        var allEvents = [];
        var rating = 0;

        var meaningOfLife = 42;
        var service = {
            addEvents: addEvents,
            setRating: setRating,
            events: []
        }
        return service;

        function addEvents(events) {
            allEvents = events;
            filter();
            return service.events;
        }

        function filter() {
            var filteredEvents = _.uniq(allEvents, 'title');
            filteredEvents = _.filter(filteredEvents, function(event) {
                return event.venue.Rating >= rating;
            });
            filteredEvents = _.reject(filteredEvents, function(event) {
                return _.find(calendarService.events, 'title', event.title) ||
                    _.find(calendarService.rejectedEvents, 'title', event.title);
            });
            service.events = filteredEvents;
            $rootScope.$broadcast('events-updated');
        }

        function setRating(newRating) {
            rating = newRating;
            filter();
        }

    });
