(function () {
  describe('createContextualFragment tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "createContextualFragment()";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var createContextualFragment = "static string";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'var documentFragment = range.createContextualFragment("<h1>bad</h1>");';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations:true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
