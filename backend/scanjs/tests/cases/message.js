(function() {
  describe('message tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
        var good = 'var a = "message";';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}),  "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var message = "static string";';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}),  "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'function receiveMessage() { console.log(1); }';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}),  "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'function message() { console.log(1); }';
        it(good, function(){
          chai.expect(ScanJS.scan(acorn.parse(good, {locations:true}),  "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
        var bad = 'window.addEventListener("message", receiveMessage, false);';
        it(bad, function(){
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations:true}),  "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
