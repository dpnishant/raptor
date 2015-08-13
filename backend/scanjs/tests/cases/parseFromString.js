(function () {
  describe('parseFromString tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "parseFromString";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'doc = parser.parseFromString("<h1>somehtml</h1>", "text/html");';
        it.skip(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'doc = parser.parseFromString(someVar, "text/html");';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
