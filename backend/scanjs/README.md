ScanJS
======

![travis-ci](https://travis-ci.org/mozilla/scanjs.svg)

ScanJS is a Static analysis tool for javascript code. ScanJS was created as an aid for security review, to help identify security issues in client-side web applications.

ScanJS uses Acorn to convert sources to AST, then walks AST looking for source patterns. Use the rules file supplied, or load your own rules. 

ScanJS Rules
------------------------
Rules are specified in JSON format - for an example see ```/common/template_rules.json```

At a minimum, each must have rule is made up of 2 attributes:
- name: the name of the rule
- source: javascript source which matches one of the patterns below (see Rule Syntax below)

Optionally a rule may have the following attirbutes:
- testhit: one more JavaScript statements (seperate by semi-colons) that the rule will match
- testmiss: the rule should not match any of these statements
- desc: description of the rule
- threat: for catgorizing rules by threat


Rule Syntax
------------------------

For the `source` attribute, the following basic statements are supported:
- identifier `foo`: matches any identifier ,  "foo"
- property `$_any.foo`: $_any is wildcard, matches anything.foo
- objectproperty `foo.bar`: matches object and property, i.e. foo.bar

You can also matches function calls based on the same syntax:
- call `foo()`: matches function calls with this name
- propertycall `$_any.foo`: matches anything.foo() but not foo()
- objectpropertycall: `foo.bar()`: matches foo.bar() only

You can also search for functions with matching literal arguments:

- callargs `foo('test',ignored,42)`: matches a function called foo, with 'test' as the first argument, anything as the second argument, and the number 42 as the third argument (i.e. matches ONLY literal arguments).
- propertycallargs `$_any.foo('test',ignored,42)`: same as above, but function has to be a property.
- objectpropertycallargs `foo.bar('test',ignored,42)`: same as above, but matches both object and property

You can also search for assignment to a specifically named identifier:

- assignment `foo=$_any`: matches when foo is assigned to something
- propertyassignment `$_any.foo=$_any`: matches when anything.foo is assigned to something
- objectpropertyassignment `foo.bar=$_any`: matches when foo.bar is assigned to something

If you specify `$_unsafe` on the right hand side (e.g. foo.innerHTML=$_unsafe), it will only match if the RHS contains at least one identifier.

Tips:
- Javascript is very dynamic, and this is navie approach: write conservative rules and review for false positives
- One simple statement per rule, not complex statements (yet)! 
- 'foo' does NOT match 'this.foo', if you are looking for something in global (e.g. 'alert()' ), you need to add two rules: 'alert.()' and '$_any.alert()'
- Try the rule out in the experiment tab to test what it matches


Examples:
See /common/template_rules.json and /common/rules.json

Running ScanJS
======================

Run ScanJS in the browser
------------------------
- Install [node.js](http://nodejs.org/)
- ```nodejs server.js```
- Navigate to http://127.0.0.1:4000/client/ or see our [example page](http://mozilla.github.io/scanjs/client/)

Run ScanJS from the command line
------------------------
- Install [node.js](http://nodejs.org/)
- ```scanner.js -t DIRECTORY_PATH```

Testing instructions
------------------------
Tests use the mocha testing framework.

- `npm test` 
- or in the browser:```http://127.0.0.1:4000/tests/```

Tests are included in the rules declaration (see common/rules.json) by specifying the following two attributes, which are specified in the form of a series of javascript statements:

- _testhit_: The rule should match each of these statements individualy. 
- _testmiss_: The rule should not match all of these statements.


