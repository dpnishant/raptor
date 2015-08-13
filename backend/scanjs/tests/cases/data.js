(function () {
  describe('data attribute tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "something.data";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var data = "something";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'form.data = "mystring";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'var a = event.data;';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'readPipe(event.something.data.pipe, a, b);';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'readPipe(event.data.pipe, a, b);';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
