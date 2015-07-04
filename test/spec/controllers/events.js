'use strict';

describe('Controller: EventsCtrl', function () {

  // load the controller's module
  beforeEach(module('datenightApp'));

  var EventsCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    EventsCtrl = $controller('EventsCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsCtrl.awesomeThings.length).toBe(3);
  });
});
