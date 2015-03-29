'use strict';

var app = angular.module("tradeGeckoApp", []);

//controller to search to and display from GitHub
app.controller("tradeGeckoCtrl", ["$scope", "$http", function ($scope, $http) {

  //initialize variables
  var endOfResult = false, stillSearching = false, currentKeyword = "", startPage = 1;

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
    startPage = 1;
    endOfResult = false;
    currentKeyword = $scope.keyword;
    $scope.showErrorMessage = false;
    delete $scope.errorMessage;
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
    $http.get("https://api.github.com/legacy/repos/search/" + encodeURIComponent(currentKeyword) + "?start_page=" + startPage)
      .success(function (data) {
        callback(null, data.repositories);
      })
      .error(function (err) {
        callback(err);
      });
  }
  
  /**
   * Handle data from API call
   * @param {Object}  err       error object from API call
   * @param {Object}  data      respositories from API call
   * @param {Boolean} newSearch true if API call was based on a new search i.e. using the search button
   */
  function dataHandler(err, data, newSearch) {
    //check if error is due to end of result
    if (err) {
      if (err.message === "Only the first 1000 search results are available") {
        //set end of result to true to prevent further api call since there are no more results
        endOfResult = true;
      } else {
        //log error in console
        console.log("Error: ", err);
        
        //show error message in html
        $scope.showErrorMessage = true;
        $scope.errorMessage = "Error: " + err.message;
      }
      
    } else if (data && data.length === 0) {
      //set end of result to true to prevent further api call since there are no more results
      endOfResult = true;
      
    } else {
      //append new results
      appendResults(data, newSearch);
      //update start page
      startPage += 1;
    }
  }

  //submit api request to github and update results
  $scope.searchGitHub = function (newSearch) {
    //if search is new, reset start page to 1
    if (newSearch) { resetSearch(); }

    //if the end of result is reach, do not trigger API call
    if (endOfResult) { return; }

    //fire search API call and update results only if the previous has completed
    if (!stillSearching && currentKeyword !== "") {
      //set to searching state
      stillSearching = true;
      //disable search button, update button label and show loading message
      setToNonSearchableState();

      updateResults(newSearch, function (err, data) {
        //set to no longer searching state
        stillSearching = false;
        
        //update displayed result
        dataHandler(err, data, newSearch);

        //enable search button, update button label and clear loading message
        setToSearchableState();
      });
    }
  };

  //toggle showing repo details
  $scope.toggleRepoDetails = function (index) {
    $scope.repos[index].showDetails = !$scope.repos[index].showDetails;
  };

  //initialize scope
  $scope.header = "TradeGecko";
  setToSearchableState();

}]);

//directive to call function when scroll to end of page
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
    scope: { scrollEndFunction: '&' },
    link: link
  };
}]);
