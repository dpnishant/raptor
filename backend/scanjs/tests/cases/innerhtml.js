(function () {
  describe('innerHTML tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'good.innerHTML = "static string";';
        it.skip(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = document.createElement("div"); a.setAttribute("innerHTML", "<h1>bad</h1>"); document.body.appendChild(a);';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var getInnerHtml = document.getElementById("node").innerHTML;';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = '//div.innerHTML = this is a comment';
        it(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'div.innerHTML = 1';
        it.skip(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
      context(null, function () {
        //issue 71 - https://github.com/mozilla/scanjs/issues/71
        var good = 'var a = 1; div.innerHTML = a';
        it.skip(good, function () {
          chai.expect(ScanJS.scan(acorn.parse(good, {locations: true}), "/tests/")).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'dangerous.innerHTML=document.location;';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'div.innerHTML = "static string" + someVariable;';
        it(bad, function () {
          chai.expect(ScanJS.scan(acorn.parse(bad, {locations: true}), "/tests/")).not.to.be.empty;
        });
      });
    });
  });
})();
