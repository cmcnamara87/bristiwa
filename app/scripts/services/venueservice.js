'use strict';

/**
 * @ngdoc service
 * @name datenightApp.venueService
 * @description
 * # venueService
 * Factory in the datenightApp.
 */
angular.module('datenightApp')
    .factory('venueService', function(venueData) {
      
        
        var venueService = {
            getVenueByName: getVenueByName
        };

        return venueService;


        ////


        function getVenueByName(name) {
            return _.find(venueData, function(venue) {
                return venue.Location.indexOf(name) >= 0;
            }) || { Rating: 0 };
        }
    });
