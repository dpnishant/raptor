"use strict";

scanjsModule.controller('RuleListCtrl', ['$scope', 'ScanSvc', function RuleListCtrl($scope, ScanSvc) {
  $scope.rulesFile = "../common/rules.json";
  $scope.rules = []; //JSON rules object

  document.getElementById("rule-file-input").addEventListener("change", function (evt) {
    $scope.handleFileUpload(this.files);
  });

  function loadRulesFile(rulesFile) {
    //TODO rewrite with $http()
    var request = new XMLHttpRequest();
    request.open('GET', rulesFile);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        $scope.rules = JSON.parse(request.responseText);

        ScanSvc.loadRules($scope.rules);
      } else {
        console.log('Error loading ' + rules)
      }
      $scope.$apply();
    };

    request.onerror = function () {
      console.log('Connection error while loading ' + rulesFile)
    };
    request.send();
  }

  $scope.handleFileUpload = function handleFileUpload(fileList) {

    $scope.rulesFile = fileList[0].name;

    var reader = new FileReader();
    reader.onload = function () {
      $scope.rules = JSON.parse(this.result);
      ScanSvc.loadRules($scope.rules);
      $scope.$apply();
    }

    reader.readAsText(fileList[0])
  };

  loadRulesFile($scope.rulesFile);
}]);
