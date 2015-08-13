(function () {
  describe('CustomEvent tests - future rule?', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "CustomEvent";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'good.CustomEvent = "CustomEvent";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'obj.addEventListener("cat", function(e) { process(e.detail) }); var event = new CustomEvent("cat",  {"detail":{"hazcheeseburger":true}});  obj.dispatchEvent(event);';
        it.skip(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
