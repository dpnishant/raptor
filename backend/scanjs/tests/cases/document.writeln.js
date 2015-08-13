(function () {
  describe('document.writeln tests', function () {
    describe('ignores safe patterns', function () {
      context(null, function () {
        var good = 'good.writeln = "static string";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'good = "document.writeln";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
    });
    describe('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'document.writeln("Hello World!");';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'window.document.writeln("Hello World!");';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 76 - https://github.com/mozilla/scanjs/issues/76
        var bad = 'var a = window.document; a.b = document.writeln; a.b("<h1>bad</h1>");';
        it.skip(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
