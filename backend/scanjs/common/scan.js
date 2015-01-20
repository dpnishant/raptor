(function (mod) {

  // CommonJS
  if (typeof exports == "object" && typeof module == "object")
    return mod(
      exports,
      require('../client/js/lib/walk.js')
    );

  // AMD
  if (typeof define == "function" && define.amd)
    return define([
      "exports",
      "../client/js/lib/walk.js"
    ], mod);

  // Plain browser env
  mod(this.ScanJS || (this.ScanJS = {}), this.acorn.walk);
})(function (exports, walk) {
  "use strict";

  // Default parser, override this object to change*
  // needs parser.parse to produce an AST
  // and parser.walk the walk.js lib

  var parser = {};
  if (typeof acorn !== 'undefined' && acorn ){
    parser = acorn;
  }


  var rules = {};
  var results = [];

  var aw_found = function (rule, node) {

    results.push({
      type: 'finding',
      rule: rule,
      filename: results.filename,
      line: node.loc.start.line,
      col: node.loc.start.col
    });

    aw_found_callback(rule, node);
  };
  var aw_found_callback = function () {
  };

  var templateRules = {
    identifier: {
      nodeType: "Identifier",
      test: function (testNode, node) {
        if (node.type == "Identifier" && node.name == testNode.name) {
          return true;
        }
      }
    },
    property: {
      nodeType: "MemberExpression",
      test: function (testNode, node) {
        // foo.bar & foo['bar'] create different AST but mean the same thing

        var testName = testNode.property.type == 'Identifier' ? testNode.property.name : testNode.property.value;
        if (node.property && (node.property.name == testName || node.property.value == testName)) {
          return true;
        }
      }
    },
    object: {
      nodeType: "MemberExpression",
      test: function (testNode, node) {
        // foo.bar & foo['bar'] create different AST but mean the same thing
        if (node.object.name == testNode.object.name) {
          return true;
        }
      }
    },
    objectproperty: {
      nodeType: "MemberExpression",
      test: function (testNode, node) {
        // foo.bar & foo['bar'] create different AST but mean the same thing
        var testName = testNode.property.type == 'Identifier' ? testNode.property.name : testNode.property.value;

        if ((node.property && (node.property.name == testName || node.property.value == testName)) &&
          (node.object.name == testNode.object.name ||  // this matches the foo in foo.bar
            (node.object.property && node.object.property.name == testNode.object.name)  )) { //this matches foo in nested objects e.g. baz.foo.bar
          return true;
        }
      }
    },
    new: {
      nodeType: "NewExpression",
      test: function (testNode, node) {
        if (node.callee.name == testNode.callee.name) {
          return true;
        }
      }
    },
    call: {
      nodeType: "CallExpression",
      test: function (testNode, node) {
        // matches foo()
        if (node.callee.type == 'Identifier' &&
          node.callee.name == testNode.callee.name) {
          return true;
        }
      }
    },
    propertycall: {
      nodeType: "CallExpression",
      test: function (testNode, node) {
        if (templateRules.property.test(testNode.callee, node.callee)) {
          return true;
        }
      }
    },
    objectpropertycall: {
      nodeType: "CallExpression",
      test: function (testNode, node) {
        if (templateRules.objectproperty.test(testNode.callee, node.callee)) {
          return true;
        }
      }
    },
    matchArgs: function (testNode, node) {
      var matching = node.arguments.length > 0;
      var index = 0;
      while (matching && index < testNode.arguments.length) {
        var testArg = testNode.arguments[index];
        //ensure each literal argument matches
        if (testArg.type == "Literal") {
          if (typeof node.arguments[index] == 'undefined' || node.arguments[index].type != "Literal" || testArg.value != node.arguments[index].value) {
            matching = false;
          }
        }
        index++;
      }
      if (matching) {
        return true;
      }
    },
    callargs: {
      nodeType: "CallExpression",
      test: function (testNode, node) {
        if (templateRules.call.test(testNode, node) &&
          templateRules.matchArgs(testNode, node)) {
          return true;
        }
      }
    },
    propertycallargs: {
      nodeType: "CallExpression",
      test: function (testNode, node) {
        if (templateRules.propertycall.test(testNode, node) &&
          templateRules.matchArgs(testNode, node)) {
          return true;
        }
      }
    },
    objectpropertycallargs: {
      nodeType: "CallExpression",
      test: function (testNode, node) {
        if (templateRules.objectpropertycall.test(testNode, node) &&
          templateRules.matchArgs(testNode, node)) {
          return true;
        }
      }
    },
    assignment: {
      nodeType: "AssignmentExpression",
      test: function (testNode, node) {
        if (templateRules.identifier.test(testNode.left, node.left)) {
          //support $_unsafe for RHS of assignment
          var unsafe = true;
          if (testNode.right.type == "Identifier" && testNode.right.name == "$_unsafe") {
            unsafe = templateRules.$_contains(node.right, "Identifier")
          }
          return unsafe;
        }
      }
    },
    propertyassignment: {
      nodeType: "AssignmentExpression",
      test: function (testNode, node) {
        //support $_unsafe for RHS of assignment
        var unsafe = true;
        if (testNode.right.type == "Identifier" && testNode.right.name == "$_unsafe") {
          unsafe = templateRules.$_contains(node.right, "Identifier")
        }

        if (templateRules.property.test(testNode.left, node.left) && unsafe) {
          return true;
        }
      }
    },
    objectpropertyassignment: {
      nodeType: "AssignmentExpression",
      test: function (testNode, node) {

        //support $_unsafe for RHS of assignment
        var unsafe = true;
        if (testNode.right.type == "Identifier" && testNode.right.name == "$_unsafe") {
          unsafe = templateRules.$_contains(node.right, "Identifier")
        }

        if (templateRules.objectproperty.test(testNode.left, node.left) && unsafe) {
          return true;
        }
      }
    },
    $_contains: function (node, typestring) {
      var foundnode = walk.findNodeAt(node, null, null, typestring);
      return typeof foundnode != 'undefined'
    },
    ifstatement: {
      nodeType: "IfStatement",
      test: function (testNode, node) {
        if (testNode.test.type == "CallExpression" && testNode.test.callee.name == "$_contains") {
          if (testNode.test.arguments[0].type == "Literal") {
            if (templateRules.$_contains(node.test, testNode.test.arguments[0].value)) {
              return true;
            }
          }
        }
      }
    }
  };

  function aw_loadRulesFile(rulesFile, callback) {

    var request = new XMLHttpRequest();

    request.open('GET', rulesFile, false);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        rulesData = JSON.parse(request.responseText);
        aw_loadRules(rulesData);
        if (typeof callback == 'function')
          callback(rules);
      } else {
        console.log('Error loading ' + rules)
      }
    };

    request.onerror = function () {
      console.log('Connection error while loading ' + rulesFile)
    };
    request.send();
  }


  function aw_parseRule(rule) {
    try {
      var program = parser.parse(rule.source);
      //each rule must contain exactly one javascript statement
      if (program.body.length != 1) {
        throw ('Rule ' + rule.name + 'contains too many statements, skipping: ' + rule.source);

      }
      rule.statement = program.body[0]
    } catch (e) {
      throw('Can\'t parse rule:' + rule.name );
    }

    if (rule.statement.type == "IfStatement") {
      return 'ifstatement';
    }

    //identifier
    if (rule.statement.expression.type == "Identifier") {
      return 'identifier';
    }

    if (rule.statement.expression.type == "NewExpression") {
      return 'new';
    }

    //property, objectproperty
    if (rule.statement.expression.type == "MemberExpression") {
      if (rule.statement.expression.object.name == "$_any") {
        //rule is $_any.foo, this is a property rule
        return 'property';
      } else if (rule.statement.expression.property.name == "$_any") {
        return 'object';
      }
      else {
        return 'objectproperty';
      }
    }
    //call, propertycall,objectpropertycall ( + args variants)
    if (rule.statement.expression.type == "CallExpression") {
      var args = '';
      if (rule.statement.expression.arguments.length > 0) {
        args = 'args';
      }

      if (rule.statement.expression.callee.type == "Identifier") {
        return 'call' + args;
      } else if (rule.statement.expression.callee.type == "MemberExpression") {
        if (rule.statement.expression.callee.object.name == "$_any") {
          return 'propertycall' + args;
        } else {
          return 'objectpropertycall' + args;
        }
      }
    }

    //assignment, propertyassignment, objectpropertyassignment
    if (rule.statement.expression.type == "AssignmentExpression") {
      if (rule.statement.expression.left.type == "MemberExpression") {
        if (rule.statement.expression.left.object.name == "$_any") {
          return 'propertyassignment';
        } else {
          return 'objectpropertyassignment';
        }
      } else {
        return 'assignment';
      }
    }


    //if we get to here we couldn't find a matching template for the rule.source
    throw ("No matching template")
  }

  function aw_loadRules(rulesData) {

    var nodeTests = {};
    //each node type may have multiple tests, so first create arrays of test funcs
    for (var i in rulesData) {
      var rule = rulesData[i];
      //parse rule source
      var template;
      try {
        template = templateRules[aw_parseRule(rule)];
      } catch (e) {
        console.log("Error parsing rule " + rule.name, rule.source)
        break;
      }

      if (typeof template == 'undefined') {
        console.log("Should never get here.")
        break;
      }

      if (!nodeTests[template.nodeType]) {
        nodeTests[template.nodeType] = [];
      }
      nodeTests[template.nodeType].push(function (template, rule, node) {
        if (rule.statement.expression) {
          if (template.test(rule.statement.expression, node)) {
            aw_found(rule, node);
          }
        }
        else {
          if (template.test(rule.statement, node)) {
            aw_found(rule, node);
          }
        }
      }.bind(undefined, template, rule));
    }


    rules = {};
    //create a single function for each nodeType, which calls all the test functions
    for (var nodeType in nodeTests) {
      rules[nodeType] = function (tests, node) {
        tests.forEach(function (test) {
          test.call(this, node);
        });
      }.bind(undefined, nodeTests[nodeType]);
    }
  }

  function aw_scan(ast, filename) {
    results = [];
    results.filename = "Manual input"

    if (typeof filename != 'undefined') {
      results.filename = filename;
    }
    if (!rules) {
      return [
        {
          type: 'error',
          name: 'RulesError',
          pos: 0,
          loc: { column: 0, line: 0 },
          message: "Could not scan with no rules loaded.",
          filename: filename
        }
      ];
    }
      walk.simple(ast, rules);

    return results;
  }

  function aw_setCallback(found_callback) {
    aw_found_callback = found_callback;
  }

  function aw_setParser(newParser){
    parser = newParser;
  }

  exports.rules = rules;
  exports.scan = aw_scan;
  exports.loadRulesFile = aw_loadRulesFile;
  exports.loadRules = aw_loadRules;
  exports.parseRule = aw_parseRule;
  exports.setResultCallback = aw_setCallback;
  exports.parser = aw_setParser;

});
