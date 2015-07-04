'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('EventsCtrl', function($http, $scope, TDCardDelegate, calendarService, venueService) {

        var vm = this;
        vm.hello = 'world';


        var cardTypes = [{
            image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png'
        }, {
            image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png'
        }, {
            image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png'
        }, ];

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            $scope.addCard();
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.unshift(angular.extend({}, newCard));
        };

        $scope.cards = [];
        for (var i = 0; i < 3; i++) {
            $scope.addCard();
        }

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            calendarService.rejectEvent(vm.events[index]);
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            calendarService.addEvent(vm.events[index]);

            $scope.addCard();
        };

        activate();

        ////

        function activate() {
            getEvents();
        }

        function getVenueNameForEvent(event) {
            var venueData = _.find(event.customfield, {
                'name': 'Venue'
            });
            if(!venueData) {
                return null;
            }
            return venueData.content;
        }

        function getVenueForEvent(event) {
            var venueName = getVenueNameForEvent(event);
            if (!venueName) {
                return {
                    Rating: 0
                };
            }
            return venueService.getVenueByName(venueName);
        }

        function getEvents() {
            var rss = 'http://www.trumba.com/calendars/visble-ink.rss';
            var query = 'select * from rss where url="' + rss + '"';
            return $http.get('http://query.yahooapis.com/v1/public/yql', {
                params: {
                    q: query,
                    format: 'json'
                }
            }).then(function(response) {

                var accessibleOnly = true;
                var events = _.map(response.data.query.results.item, function(item) {
                    return {
                        title: item.title,
                        image: angular.element('<div>' + item.description[0] + '</div>').find('img').attr('src'),
                        startDate: parseDate(item.dtstart),
                        endDate: item.dtend,
                        description: item.description,
                        location: item.location,
                        venueName: getVenueNameForEvent(item),
                        venue: getVenueForEvent(item)
                    };
                });

                events = _.uniq(events, 'title');

                vm.events = _.reject(events, function(event) {
                    console.log(event.venue.Rating);
                    return _.find(calendarService.events, 'title', event.title) ||
                        _.find(calendarService.rejectedEvents, 'title', event.title);
                });

            });
        }

        function parseDate(timestamp) {
            var splitDate = timestamp.split(/[^0-9]/);
            return new Date (splitDate[0],splitDate[1]-1,splitDate[2],splitDate[3],splitDate[4],splitDate[5]);
        }
    });
