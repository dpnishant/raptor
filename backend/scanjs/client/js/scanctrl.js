"use strict";

scanjsModule.controller('ScanCtrl', ['$scope', 'ScanSvc', function ScanCtrl($scope, ScanSvc) {
  if (!document.getElementById("codeMirrorDiv").children.length) {
  $scope.codeMirror = new CodeMirror(document.getElementById('codeMirrorDiv'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'mdn-like',
    value: "",
    readOnly:true,
    tabsize: 2,
    styleActiveLine: true
  });
  }
  $scope.codeMirrorManual = undefined;
  $scope.inputFiles = [];
  $scope.results=[];
  $scope.errors=[];
  $scope.filteredResults=[];
  $scope.inputFilename="";
  $scope.issueList=[];
  $scope.throbInput = false;
  $scope.throbOutput = false;

  var pending = 0;
  var selectedFile = 0;
  var codeMirror_index = 0;

  document.getElementById("scan-file-input").addEventListener("change", function(evt) {
    $scope.handleFileUpload(this.files);
  });

  $scope.run = function (source, filename) {
    //empty last scan
    $scope.results=[];
    $scope.errors=[];
    $scope.inputFiles.forEach(function (scriptFile, i) {
      if (document.getElementById('doScan_'+i).checked) {
        pending++;
        $scope.throbOutput = true;
        ScanSvc.newScan(scriptFile.name,scriptFile.asText());
      }
    });

    //update UI
    document.querySelector("#scan-input").classList.toggle("hidden",true);
    document.querySelector("#scan-results").classList.toggle("hidden",false);
    document.querySelector("#scan-output-rules").classList.toggle("hidden", false);
    document.querySelector("#scan-output-files").classList.toggle("hidden", false);

    //update navbar
    document.querySelector("#scan-input-nav").classList.toggle("active",false);
    document.querySelector("#scan-output-nav").classList.toggle("active",true);
  }

  $scope.updateIssueList = function(){
    $scope.issueList = $scope.results.reduce(function(p, c) {
      if ((c.type == 'finding') && (typeof p !== "undefined")) {
        if (p.indexOf(c.rule.name) < 0) {
          p.push(c.rule.name);
        }
        return p;
      }
    }, []);
  }

  $scope.filterResults=function(issue) {
    if (!issue) {
      $scope.filteredResults=$scope.results;
    }
    else {
      if (typeof issue.name != "undefined") {
        $scope.filteredResults = $scope.results.filter(function(result) {
          return result.filename === issue.name;
        });
      } else {
        $scope.filteredResults = $scope.results.filter(function(result) {
          return result.rule.name == issue;
        });
      }
    }
  }

  $scope.navShowInput = function () {
    //show input tab, hide results
    document.querySelector("#scan-input").classList.toggle("hidden", false);
    document.querySelector("#scan-results").classList.toggle("hidden", true);
    document.querySelector("#scan-output-rules").classList.toggle("hidden", true);
    document.querySelector("#scan-output-files").classList.toggle("hidden", true);
    //make input the active nav element
    document.querySelector("#scan-input-nav").classList.toggle("active", true);
    document.querySelector("#scan-output-nav").classList.toggle("active", false);
  }

  $scope.navShowOutput = function (filterIssue) {
    //show input tab, hide results
    document.querySelector("#scan-input").classList.toggle("hidden", true);
    document.querySelector("#scan-results").classList.toggle("hidden", false);
    document.querySelector("#scan-output-rules").classList.toggle("hidden", false);
    document.querySelector("#scan-output-files").classList.toggle("hidden", false);
    //make input the active nav element
    document.querySelector("#scan-input-nav").classList.toggle("active", false);
    document.querySelector("#scan-output-nav").classList.toggle("active", true);
    $scope.filterResults(filterIssue);
  }

  $scope.handleFileUpload = function handleFileUpload(fileList) {
    function handleMaybeZip() {
      //packaged app case
      var reader = new FileReader();
      $scope.inputFilename = fileList[0].name;
      reader.onload = function () {
        var magic = new DataView(this.result).getUint32(0, true /* LE */);
        if (magic !== 0x04034b50) { // magic marker per spec.
          handleList();
          return;
        }
        reader.onload = function() {
          var zip = new JSZip(this.result);
          $scope.inputFiles = zip.file(/\.js$/);
          $scope.$apply();
        };
        reader.readAsArrayBuffer(fileList[0]);
      };
      reader.readAsArrayBuffer(fileList[0].slice(0, 4));
    };

    function handleList() {
      //uploading individual js file(s) case
      $scope.inputFilename="Multiple files";
      var jsType = /(text\/javascript|application\/javascript|application\/x-javascript)/;
      var zip = new JSZip(); //create a jszip to manage the files

      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        console.log('adding file:',file.name)
        if (!file.type.match(jsType)) {
          console.log("Ignoring non-js file:" + file.name + "(" + file.type + ")")
        }
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (function (file) {
          var fileName = file.name;
          return function(e){
            //add file to zip
            zip.file(fileName, e.target.result)
            $scope.inputFiles = zip.file(/.*/); //returns an array of files
            $scope.$apply();

          };
        })(file)

        reader.onerror = function (e) {
          $scope.error = "Could not read file";
          $scope.$apply();
        }
      }
    };
    $scope.throbInput = true;
    $scope.$apply();
    //enable fileselect div
    //document.querySelector("#scan-intro").classList.toggle("hidden",true);
    document.querySelector("#scan-files-selected").classList.toggle("hidden",false);

    if (fileList.length === 1) {
      handleMaybeZip();
    }
    else {
      handleList();
    }
    $scope.throbInput = false;
    $scope.$apply();
  }

  $scope.showFile = function (index) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    if($scope.inputFiles.length<1){
      return;
    }
    if(!index){
      index=0;
    }
    if ($scope.inputFiles.length > 0) {
      $scope.codeMirror.setValue($scope.inputFiles[index].asText());
    }
    codeMirror_index = index;
    document.querySelector("#filename-badge").textContent = $scope.inputFiles[index].name;
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    document.querySelector("#filename-badge").textContent = filename;
    var file = $scope.inputFiles.find(function(f){return f.name === filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };

  $scope.saveState = function() {
    var includedAttributes = ['line','filename','rule', 'desc', 'name', 'rec','type'];
    /* A list of attributes we want include. Example:
    line: ..
    filename: ..
    rule: {
      desc: ..
      name: ..
      rec: ..
      type: ..
      }
    }
     */
    var serializedResults = JSON.stringify($scope.results, includedAttributes);
    localforage.setItem('results', serializedResults, function() { });

    var serializedErrors = JSON.stringify($scope.errors);
    localforage.setItem('errors', serializedErrors, function() { });

    var serializedInputFiles = $scope.inputFiles.map( function(el) { return {data: el.asText(), name: el.name }; });
    localforage.setItem("inputFiles", JSON.stringify(serializedInputFiles), function(r) { });

    var checkboxes = [];
    for (var i=0; i < $scope.inputFiles.length; i++) {
      checkboxes.push(document.getElementById("doScan_" + i).checked);
    }
    localforage.setItem("checkboxes", JSON.stringify(checkboxes));
    localforage.setItem("cm_index", JSON.stringify(codeMirror_index));
  };

  //TODO loadstate isn't called anymore, need to make it work with new workflow
  //TODO -> call loadState() around in main.js, line 36 (using the scanCtrlScope) and expose "reset" button in the UI.
  $scope.restoreState = function() {
    var apply = false;
    localforage.getItem('results', function (results_storage) {
      $scope.results = JSON.parse(results_storage);
      apply = true;
      });
    localforage.getItem('errors', function (errors_storage) {
      if (errors_storage) {
        $scope.errors = JSON.parse(errors_storage);
        apply = true;
      }
    });
    // restore files, by creating JSZip things :)
    localforage.getItem("inputFiles", function(inputFiles_storage) {
      // mimic behavior from handleFileUpload
      var files = JSON.parse(inputFiles_storage);
      var zip = new JSZip();
      files.forEach(function(file) {
        zip.file(file.name, file.data);
      });
      $scope.inputFiles = zip.file(/.*/);

      // nest checkbox import into the one for files, so we ensure the "inputFiles.length" check succeeds.
      localforage.getItem("checkboxes", function (checkboxes_storage) {
        var checkboxes = JSON.parse(checkboxes_storage);

        var ln=$scope.inputFiles.length
        for (var i=0; i < ln; i++) {
          document.getElementById("doScan_" + i).checked = checkboxes[i];
        }
      });
      apply = true;
    });
    if (apply) { $scope.$apply(); }
  };

  $scope.selectAll = function () {
    var element;
    var i = $scope.inputFiles.length-1;
    while (element=document.getElementById('doScan_'+i)) {
      element.checked = true;
      i--;
    }
  };
  $scope.selectNone = function () {
    var element;
    var i = $scope.inputFiles.length-1;
    while (element=document.getElementById('doScan_'+i)) {
      element.checked = false;
      i--;
    }
  };
  $scope.getSnippet = function (filename,line,numLines) {
    var file = $scope.inputFiles.find(function (f) {
      return f.name === filename
    });
    var content=file.asText();
    return content.split('\n').splice(line,line+numLines).join('\n');
  };

  $scope.$on('NewResults', function (event, result) {
    if (--pending <= 0) { $scope.throbOutput = false; }
    if (Object.keys(result).length === 0) {
      $scope.error = "Empty result set (this can also be a good thing, if you test a simple file)";
      return
    }
    $scope.results=$scope.results.concat(result.findings);
    $scope.filteredResults=$scope.results;
    $scope.error = "";
    $scope.updateIssueList();
    /* this is likely a bug in angular or how we use it: the HTML template sometimes does not update
       when we change the $scope variables without it noticing. $scope.$apply() enforces this. */
    $scope.$apply();
    $scope.saveState();
  });

  $scope.$on('ScanError', function (event, exception) {
    if (--pending <= 0) { $scope.throbOutput = false; }
    $scope.errors.push(exception);
    $scope.updateIssueList();
    $scope.$apply();
    $scope.saveState();
  });

}]);
