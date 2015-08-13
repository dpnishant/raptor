(function() {
  describe('eval tests', function() {
    context('ignores safe patterns', function() {
      context(null, function() {
	var good = 'var a = "eval(alert(1));";';
	it(good, function(){
	  chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
	});
      });
      context(null, function() {
	var good = 'var a = {}; a.eval = "somstring";';
	it(good, function(){
	  chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}),  "/tests/")).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function() {
	var bad = 'eval("alert(0);");;';
	it(bad, function(){
	  chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}),  "/tests/")).not.to.be.empty;
	});
      });
      context(null, function() {
	// issue 76 - https://github.com/mozilla/scanjs/issues/76
	var bad = 'var a = eval; a("alert(0);");';
	it.skip(bad, function(){
	  chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}),  "/tests/")).not.to.be.empty;
	});
      });
    });
  });
})();
