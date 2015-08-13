(function () {
  describe('action attribute (mainly for forms) test', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var action = "static string";';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'var a=document.createElement("form"); a.action="demo_form.asp"; document.body.appendChild(a);';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 73 - https://github.com/mozilla/scanjs/issues/73
        var bad = 'var a=document.createElement("form"); a.setAttribute("action", "demo_form.asp"); document.body.appendChild(a);';
        it.skip(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 74 - https://github.com/mozilla/scanjs/issues/74
        var bad = 'var a=document.createElement("div"); a.innerHTML="<form action=\'demo.asp\'></form>"; document.body.appendChild(a);';
        it.skip(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
