'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('EventsCtrl', function($http, $scope, TDCardDelegate, calendarService, venueService, eventsService,
        $ionicLoading,
        $ionicModal, $timeout, $rootScope) {

        var vm = this;
        vm.showEventInfo = showEventInfo;
        vm.likeEvent = likeEvent;
        vm.nopeEvent = nopeEvent;
        vm.manualLikeEvent = manualLikeEvent;
        vm.manualNopeEvent = manualNopeEvent;
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
            if (cardIndex >= eventsService.events.length) {
                return;
            }
            var nextCard = eventsService.events[cardIndex++];
            vm.cards.unshift(nextCard);
        };

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            var event = vm.cards[index];
            nopeEvent(event);
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            var event = vm.cards[index];
            likeEvent(event);

            $scope.addCard();
        };


        activate();

        ////

        function activate() {
            vm.eventsService = eventsService;
            getEvents();

            vm.modalScope = $scope.$new();
            $ionicModal.fromTemplateUrl('templates/modal-event-detail.html', {
                scope: vm.modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                vm.modal = modal;
            });
        }

        function setupCards() {
            vm.cards = [];
            cardIndex = 0;
            for (var i = 0; i < 3; i++) {
                $scope.addCard();
            }
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

        function getImageForEvent(item) {
            var image = '';
            var desc = item.description[0];
            var parts = desc.split('src="');
            if (parts.length) {
                image = (parts[1].split('"'))[0];
            }
            return image;
        }

        function getEvents() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br/> <div>Loading...</div>'
            });
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

                    var image = getImageForEvent(item);

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
                $ionicLoading.hide();
                return eventsService.addEvents(events);
            });
        }

        function parseDate(timestamp) {
            var splitDate = timestamp.split(/[^0-9]/);
            var date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2], splitDate[3], splitDate[4], splitDate[5]);
            date.setHours(date.getHours() + 10);
            return date;
        }

        function showEventInfo() {
            var event = getCurrentEvent();
            vm.modalScope.event = event;
            vm.openModal();
        }
        vm.openModal = function() {
            vm.modal.show();
        };
        vm.closeModal = function() {
            vm.modal.hide();
        };

        function getCurrentEvent() {
            return vm.cards[vm.cards.length - 1];
        }

        function likeEvent(event) {
            calendarService.addEvent(event);
            /*
             <button ng-click="vm.manualLikeEvent()" class="button button-balanced" style="float:left;">

             </button>
             <button ng-click="vm.showEventInfo()" class="button button-calm">
             <i class="icon ion-information"></i>
             </button>
             <button ng-click="vm.manualNopeEvent()" class="button button-assertive" style="float:right;">
             <i class="icon ion-close-round"></i>
             </button>
             */
            $ionicLoading.show({
                template: '<i class="icon ion-checkmark-round"></i>',
                noBackdrop: true,
                duration: 200
            });
        }
        function nopeEvent(event) {
            calendarService.rejectEvent(event);
            $ionicLoading.show({
                template: '<i class="icon ion-close-round"></i>',
                noBackdrop: true,
                duration: 200
            });
        }

        function manualLikeEvent() {
            var event = getCurrentEvent();
            likeEvent(event);
            TDCardDelegate.popCard($scope, true);
            vm.cards.splice(vm.cards.length - 1, 1);
            $scope.addCard();
        }
        function manualNopeEvent() {
            var event = getCurrentEvent();
            nopeEvent(event);
            vm.cards.splice(vm.cards.length - 1, 1);
            $scope.addCard();
        }

        $rootScope.$on('events-updated', function() {
            setupCards();
        });

    });
