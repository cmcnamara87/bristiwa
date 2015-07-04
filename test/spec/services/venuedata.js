'use strict';

describe('Service: venueData', function () {

  // load the service's module
  beforeEach(module('datenightApp'));

  // instantiate service
  var venueData;
  beforeEach(inject(function (_venueData_) {
    venueData = _venueData_;
  }));

  it('should do something', function () {
    expect(!!venueData).toBe(true);
  });

});
