'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('EventsCtrl', function ($http, $scope, TDCardDelegate, calendarService) {

        var vm = this;
        vm.hello = 'world';


        var cardTypes = [
            { image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png' },
            { image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png' },
            { image: 'https://raw.githubusercontent.com/driftyco/ionic-ion-tinder-cards/master/demo/ben.png' },
        ];

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            $scope.addCard();
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.unshift(angular.extend({}, newCard));
        }

        $scope.cards = [];
        for(var i = 0; i < 3; i++) $scope.addCard();

        $scope.cardSwipedLeft = function (index) {
            console.log('LEFT SWIPE');
            calendarService.rejectEvent(vm.events[index]);
            $scope.addCard();
        };
        $scope.cardSwipedRight = function (index) {
            //console.log('RIGHT SWIPE');
            calendarService.addEvent(vm.events[index]);

            $scope.addCard();
        };

        activate();

        ////

        function activate() {
            getEvents();
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

                var events = _.map(response.data.query.results.item, function(item) {
                    return {
                        title: item.title,
                        image: angular.element('<div>' + item.description[0] + '</div>').find('img').attr('src')
                    };
                });
                events = _.uniq(events, 'title');

                vm.events = _.reject(events, function(event) {
                    return _.find(calendarService.events, 'title', event.title) ||
                        _.find(calendarService.rejectedEvents, 'title', event.title);
                });

            });
        }


    });
