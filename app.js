'use strict';

var app = angular.module("tradeGeckoApp", []);

app.controller("tradeGeckoCtrl", ["$scope", "$http", function ($scope, $http) {
  function resetButton() {
    $scope.searchButtonLabel = "search";
    $scope.disableSearchButton = false;
  }

  $scope.searchGitHub = function () {
    //change search button label
    $scope.searchButtonLabel = "searching...";
    $scope.disableSearchButton = true;

    //github api request
    $http.get("https://api.github.com/legacy/repos/search/" + encodeURIComponent($scope.keyword))
      .success(function (data) {
        //populate repositories scope
        $scope.repos = data.repositories;
        //reset button label and state
        resetButton();
      })
      .error(function (err) {
        //show error in console log
        console.log(err);
        //reset button label and state
        resetButton();
      });
  };

  $scope.showRepo = function (index) {
    $scope.repos[index].show = !$scope.repos[index].show;
  };

  //initialize
  $scope.header = "TradeGecko";
  resetButton();
}]);
