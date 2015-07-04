'use strict';

describe('Controller: EventdetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('datenightApp'));

  var EventdetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventdetailsCtrl = $controller('EventdetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
