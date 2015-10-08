'use strict';

angular.module('musicappApp')
  .directive('searchBox', function () {
    return {
      templateUrl: 'app/searchBox/searchBox.html',
      restrict: 'E',
      controllerAs: 'search',
      controller: function ($scope, Search) {
        var search = this;
        search.query = '';
        search.active = false;
        search.showResults = false;

        search.makeActive = makeActive;
        search.makeInactive = makeInactive;

        $scope.$watch('search.query', function () {
          search.showResults = search.active && search.query.length > 0;
          if(search.showResults) {
            Search.get(search.query, search.category).then(function(results) {
              search.users = results.users;
              search.noResults = results.length === 0;
            });
          }
        });

        function makeActive() {
          search.active = true;
        }

        function makeInactive() {
          search.active = false;
        }
      }
    };
  });
