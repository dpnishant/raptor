(function () {
  describe('escapeHTML tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "escapeHTML";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var escapeHTML = "just a string";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'var nodeName = escapeHTML(node.name);';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
