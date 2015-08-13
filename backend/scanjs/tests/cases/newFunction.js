(function() {
  describe('new Function() tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
        var good = 'var Function = "static string";';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}),  "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
        var bad = 'new Function("alert(0)")();';
        it(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations:true}),  "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 76 - https://github.com/mozilla/scanjs/issues/76
        var bad = 'var a = Function; new a("alert(0)")();';
        it.skip(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations:true}),  "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
