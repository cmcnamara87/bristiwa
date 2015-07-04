'use strict';

describe('Controller: CardCtrl', function () {

  // load the controller's module
  beforeEach(module('datenightApp'));

  var CardCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    CardCtrl = $controller('CardCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CardCtrl.awesomeThings.length).toBe(3);
  });
});
