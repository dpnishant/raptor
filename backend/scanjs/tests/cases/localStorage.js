(function() {
  describe('localStorage tests', function() {
    context('ignores safe patterns', function() {
      context(null, function() {
        var good = 'var a  = "localStorage.open(abase)";';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
        });
      });
      context(null, function() {
        var good = 'var localStorage  = "asdf";';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function() {
        var bad = 'localStorage.setItem("name", "user1");';
        it(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}),  "/tests/")).not.to.be.empty;
        });
      });
      context(null, function() {
        // issue 82 - https://github.com/mozilla/scanjs/issues/82
        var bad = 'var a = "localStorage"; window[a].setItem("name", "user1");';
        it.skip(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}),  "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
