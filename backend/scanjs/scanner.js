#!/usr/bin/env node
/*jshint node:true*/

// This script is for using scanjs server side

var fs = require('fs');
var path = require('path');
var beautify = require('js-beautify').js_beautify;

var parser = require(__dirname+ '/client/js/lib/acorn.js');
var ScanJS = require(__dirname + '/common/scan');

var signatures = JSON.parse(fs.readFileSync(__dirname + "/common/rules.json", "utf8"));

ScanJS.parser(parser);
ScanJS.loadRules(signatures);

var argv = require('optimist').usage('Usage: $node scan.js -t [path/to/app] -o [resultFile.json]').demand(['t']).argv;

var dive = function(dir, action) {
  if( typeof action !== 'function') {
    action = function(error, file) {
      console.log(">" + file)
    };
  }
  list = fs.readdirSync(dir);
  list.forEach(function(file) {
    
    var fullpath = dir + '/' + file;
    
    var jslibs = [ //filename patterns of known JS libraries to ignore while scanning
      /bootstrap/, 
      /jquery/, 
      /uglify/,
      /knockout/,
      /angular/,
      /backbone/,
      /ember/,
      /yui/
    ]; 
    
    function matchInArray(filename, arr_jslibs) {
      for (i = 0; i < arr_jslibs.length; i++) {
        if (filename.match(arr_jslibs[i]))
          console.log("SKIPPINNG (library): " + fullpath);
          return true;
        }
      return false;
    };

    if (!matchInArray(file, jslibs)) {

      try {
        var stat = fs.statSync(fullpath);
      } catch(e) {
        console.log("SKIPPING FILE: Could not stat " + fullpath);
      }
      if(stat && stat.isDirectory()) {
        try {
          dive(fullpath, action);
        } catch (err) {
          //intentionally doing nothing; just to skip erroneous files 
          console.log('Skipping file: ' + fullpath);
        }
      } else {
        try {
          action(file, fullpath);  
        } catch (err) {}
          //intentionally doing nothing; just to skip erroneous files
        }}
  });
};
var writeReport = function(results, name) {
  if(fs.existsSync(name)) {
    console.log("Error:output file already exists (" + name + "). Supply a different name using: -o [filename]")
  }
  fs.writeFile(name, JSON.stringify(results), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The scan results were saved to " + name);
    }
  });
};


if( typeof process != 'undefined' && process.argv[2]) {
  results = {};
  reportname = argv.o ? argv.o : 'scanresults';
  reportdir = reportname + "_files";
  if(fs.existsSync(reportname) || fs.existsSync(reportdir)) {
    console.log("Error:output file or dir already exists (" + reportname + "). Supply a different name using: -o [filename]")

  } 
  else {
    fs.mkdirSync(reportdir);
    dive(argv.t, function(file, fullpath) {
      var ext = path.extname(file.toString());

      if(ext == '.js') {
        var content = fs.readFileSync(fullpath, 'utf8');
  
        //beautify source so result snippet is meaningful
        //var content = beautify(content, { indent_size: 2 });
        try {
            var ast = parser.parse(content, { locations: true });
        } catch(err) {
          //intentionally doing nothing; just to skip erroneous files
          console.log('Parser Error! Skipping: ' + fullpath);
        }

        //var ast = parser.parse(content, { locations: true });

        var scanresult = ScanJS.scan(ast, fullpath);
        if (scanresult.type == 'error') {
          console.log("SKIPPING FILE: Error in "+ fullpath+", at Line "+ scanresult.error.loc.line +", Column "+scanresult.error.loc.column+ ": " + scanresult.error.message);
        }
        results[fullpath] = scanresult;
      }
    });
    // Flatten report file to remove files with no findings and tests with no results (i.e. empty arr)
    // TODO: Don't even store empty unless --overly-verbose or so..
    for (var testedFile in results) {
      for (var testCase in results[testedFile]) {
        if (results[testedFile][testCase].length == 0) {
          delete(results[testedFile][testCase]);
        }
      }
      if (Object.keys(results[testedFile]).length == 0) {
        delete(results[testedFile]);
      }
    }
    writeReport(results, reportname + '.json');
  }
} else {
  console.log('usage: $ node scan.js path/to/app ')
}
