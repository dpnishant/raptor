"use strict";

scanjsModule.controller('LocationCtrl', ['$scope', '$location', function LocationCtrl($scope, $location) {
  $scope.tabBtnClass = function (page) {
    var current = $location.path().substring(1) || 'scan';
    //console.log("l", $location.hash(), "ls", $location.hash().substring(2))
    return page === current ? 'active' : '';
  }
}]);