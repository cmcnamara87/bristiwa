'use strict';

describe('Service: venueService', function () {

  // load the service's module
  beforeEach(module('datenightApp'));

  // instantiate service
  var venueService;
  beforeEach(inject(function (_venueService_) {
    venueService = _venueService_;
  }));

  it('should do something', function () {
    expect(!!venueService).toBe(true);
  });

});
