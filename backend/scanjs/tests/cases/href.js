(function() {
  describe('href tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
        var good = 'var href = "static string";';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = document.createElement("a"); a.setAttribute("href", "http://mozilla.org"); document.body.appendChild(a);';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = document.createElement("a"); a.setAttribute("href", 1); document.body.appendChild(a);';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function() {
      /* deactivated, failing test.
      context(null, function () {
        var bad = 'a.href ="javascript:alert(0);";';
        it(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}),  "/tests/")).not.to.be.empty;
        });
      });
      */
      context(null, function () {
        // issue 73 - https://github.com/mozilla/scanjs/issues/73
        var bad = 'var a = document.createElement("a"); a.setAttribute("href", "javascript:alert(0)"); document.body.appendChild(a);';
        it.skip(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}),  "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
