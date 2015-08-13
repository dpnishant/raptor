describe('Testing rule templates (common/template_rules.json)', function () {
  function testSetup(ruleData) {

    ruleData.forEach(function (rule) {
      describe('Rule: ' + rule.name, function () {
        it(rule.name + " should match template " + rule.name, function () {
          var template = ScanJS.parseRule(rule);
          chai.expect(rule.name).to.equal(template);
        });

        rule.testhit.split(";").forEach(function (testsplit) {
          if(testsplit.trim()!=""){
            it(rule.source + " should match " + testsplit, function () {
              ScanJS.loadRules([rule]);
              var ast = acorn.parse(testsplit, {locations: true});
              var results = ScanJS.scan(ast);
              chai.expect(results.length).to.equal(1);
            });
          }
        });

        it(rule.name + " should not match " + rule.testmiss, function () {
          ScanJS.loadRules([rule]);
          var ast = acorn.parse(rule.testmiss, {locations: true});
          var results = ScanJS.scan(ast);
          chai.expect(results).to.have.length(0);
        });
      });
    });
  }
  if (typeof $ !== "undefined") {
    $.ajax({
      url: '../common/template_rules.json',
      async: false,
      dataType: 'json'
    }).done(testSetup);
  }
  else if (typeof require !== "undefined") {
    var fs = require("fs");
    var signatures = JSON.parse(fs.readFileSync("../common/template_rules.json", "utf8"));
    testSetup(signatures);
  }
})