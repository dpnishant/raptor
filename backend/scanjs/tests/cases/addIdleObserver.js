(function () {
  describe('addIdleObserver tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "addIdleObserver()";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'addIdleObserver = "static string";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'something.addIdleObserver = "static string";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'navigator.addIdleObserver(IdleObserver);';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations:true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
