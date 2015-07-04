'use strict';

/**
 * @ngdoc function
 * @name datenightApp.controller:SettingCtrl
 * @description
 * # SettingCtrl
 * Controller of the datenightApp
 */
angular.module('datenightApp')
    .controller('SettingCtrl', function($scope, eventsService, calendarService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.checkboxModel = {
            value: false
        };

        $scope.log = function() {
            if ($scope.checkboxModel.value) {
                eventsService.setRating(3);
                return;
            }
            eventsService.setRating(0);
        };

        $scope.clearAll = function() {
        	calendarService.clearAll();
        }
    });
