'use strict';

var app = angular.module("tradeGeckoApp", []);

//controller to search to and display from GitHub
app.controller("tradeGeckoCtrl", ["$scope", "$http", function ($scope, $http) {

  //keep track of end of results and if the app is still waitiing for a response
  var endOfResult = false, stillSearching = false;

  /**
   * Enable search button, update button label and clear loading message
   */
  function setToSearchableState() {
    $scope.searchButtonLabel = "search";
    $scope.disableSearchButton = false;
    $scope.showLoadingMessage = false;
  }

  /**
   * Disable search button, update button label and show loading message
   */
  function setToNonSearchableState() {
    $scope.searchButtonLabel = "searching...";
    $scope.disableSearchButton = true;
    $scope.showLoadingMessage = true;
  }

  /**
   * Reinitialize values for new search
   */
  function resetSearch() {
    $scope.startPage = 1;
    endOfResult = false;
  }

  /**
   * Append new results to scope.repos
   * @param {Boolean} clear option to clear exisiting result
   */
  function appendResults(result, clear) {
    if (clear) { $scope.repos = []; }

    //populate repositories scope
    $scope.repos = $scope.repos.concat(result);
  }

  /**
   * API call to search git hub and update results
   * @param {Boolean} newSearch specify if this is new search
   */
  function updateResults(newSearch, callback) {
    //github api request
    $http.get("https://api.github.com/legacy/repos/search/" + encodeURIComponent($scope.keyword) + "?start_page=" + $scope.startPage)
      .success(function (data) {
        callback(null, data.repositories);
      })
      .error(function (err) {
        callback(err);
      });
  }

  //submit api request to github and update results
  $scope.searchGitHub = function (newSearch) {
    //if search is new, reset start page to 1
    if (newSearch) { resetSearch(); }

    //if the end of result is reach, do not trigger more API call
    if (endOfResult) { return; }

    //disable search button, update button label and show loading message
    setToNonSearchableState();

    //fire search API call and update results only if the previous has completed
    if (!stillSearching) {
      //set to searching state
      stillSearching = true;

      updateResults(newSearch, function (err, data) {
        //set to no longer searching state
        stillSearching = false;

        //if error check if error is due to end of result
        if (err) {
          if (err.message === "Only the first 1000 search results are available") {
            endOfResult = true;
          } else {
            //log error in console
            console.log("application error: ", err);
          }
        } else {
          //append new results
          appendResults(data, newSearch);
          //update start page
          $scope.startPage += 1;
        }

        //enable search button, update button label and clear loading message
        setToSearchableState();
      });
    }
  };

  //toggle showing repo details
  $scope.showRepo = function (index) {
    $scope.repos[index].show = !$scope.repos[index].show;
  };

  //initialize variables
  $scope.startPage = 1;
  $scope.header = "TradeGecko";
  setToSearchableState();

}]);

//directive to trigger to search for more results
app.directive('scrollEndFunction', ['$document', '$window', function ($document, $window) {

  function link(scope) {
    //using jquery library
    var document = angular.element($document), window = angular.element($window);

    //call function referenced by scope when scroll reaches the end of te screen
    window.on('scroll', function () {
      if (document.height() - window.height() - window.scrollTop() <= 0) {
        scope.scrollEndFunction();
      }
    });
  }

  return {
    scope: {scrollEndFunction: '&'},
    link: link
  };
}]);
