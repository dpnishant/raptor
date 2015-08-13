(function () {
  describe('window.open tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var open = "string window.open";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = {}; a.open = "string"; ';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = {}; a.open = function () { alert(1); }; a.open("1", "2", a);';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'win = window.open("http://www.mozilla.org", "name", fets);';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 76 - https://github.com/mozilla/scanjs/issues/76
        var bad = 'var o = window.open; o("http://www.mozilla.org", "name", {});';
        it.skip(bad, function () {
          chai.expect(ScanJS.scan(bad, "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
