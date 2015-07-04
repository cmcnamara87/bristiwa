'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('EventsCtrl', function($http, $scope, TDCardDelegate, calendarService, venueService, eventsService) {

        var vm = this;
        vm.hello = 'world';
        vm.cards = [];


        var cardTypes = [{
            image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png'
        }, {
            image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png'
        }, {
            image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png'
        }, ];

        $scope.cardDestroyed = function(index) {
            vm.cards.splice(index, 1);
            $scope.addCard();
        };

        var cardIndex = 0;

        $scope.addCard = function() {
            if(cardIndex >= eventsService.events.length) {
                return;
            }
            var nextCard = eventsService.events[cardIndex++];
            vm.cards.unshift(nextCard);
        };

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            var event = vm.cards[index];
            calendarService.rejectEvent(event);
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            var event = vm.cards[index];
            calendarService.addEvent(event);

            $scope.addCard();
        };

        
        activate();

        ////

        function activate() {
            vm.eventsService = eventsService;
            getEvents().then(function() {
                for(var i = 0; i < 3; i++) {
                    $scope.addCard();
                }
            });
        }

        function getVenueNameForEvent(event) {
            var venueData = _.find(event.customfield, {
                'name': 'Venue'
            });
            if (!venueData) {
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

        function getPrice(event) {
            var priceData = _.find(event.customfield, {
                'name': 'Cost'
            });
            console.log(priceData);
            if (!priceData) {
                return {
                    content: 'unknown'
                };
            }
            return priceData.content;
        }

        function getEvents() {
            var rss = 'http://www.trumba.com/calendars/visble-ink.rss';
            // var query = 'select * from rss where url="' + rss + '"';

            var template = 'http://www.trumba.com/calendars/';

            var query = 'select * from rss where url in ("http://www.trumba.com/calendars/visble-ink.rss", ' +
                '"http://www.trumba.com/calendars/south-bank.rss?filterview=south+bank&filter4=_464155_&filterfield4=22542", ' +
                '"http://www.trumba.com/calendars/planetarium.rss", ' +
                '"http://www.trumba.com/calendars/type.rss?filterview=movies&filter1=_178865_&filterfield1=21859", ' +
                '"http://www.trumba.com/calendars/brisbane-kids.rss?filterview=teens", ' +
                '"http://www.trumba.com/calendars/type.rss?filterview=festivals&filter1=_178868_&filterfield1=21859", ' +
                '"http://www.trumba.com/calendars/king-george-sqaure.rss?filterview=KGS&filter4=_200255_&filterfield4=22542" ' +
                ')';

            return $http.get('http://query.yahooapis.com/v1/public/yql', {
                params: {
                    q: query,
                    format: 'json'
                }
            }).then(function(response) {

                var accessibleOnly = true;
                var events = _.map(response.data.query.results.item, function(item) {
                    var desc = item.description[0];
                    var parts = desc.split('src="');
                    if(parts.length) {
                        var image = (parts[1].split('"'))[0];    
                    } else {
                        var image = '';
                    }
                    
                    return {
                        title: item.title,
                        image: image,
                        startDate: parseDate(item.dtstart),
                        endDate: item.dtend,
                        description: item.description,
                        location: item.location,
                        venueName: getVenueNameForEvent(item),
                        venue: getVenueForEvent(item),
                        price: getPrice(item)
                    };

                });
                return eventsService.addEvents(events);
            });
        }

        function parseDate(timestamp) {
            var splitDate = timestamp.split(/[^0-9]/);
            var date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2], splitDate[3], splitDate[4], splitDate[5]);
            date.setHours(date.getHours() + 10);
            return date;
        }
    });
