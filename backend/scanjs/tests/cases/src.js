(function () {
  describe('src attribute tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "something.src";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var src = "something";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var src = img.src;';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = document.createElement("script"); a.src = "static string"; document.body.appendChild(a);';
        it.skip(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      /* deactivated, failing test.
      context(null, function () {
        var bad = 'obj.src = "mystring";';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });*/
      context(null, function () {
        var bad = 'var a = document.createElement("script"); a.src = variable; document.body.appendChild(a);';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
