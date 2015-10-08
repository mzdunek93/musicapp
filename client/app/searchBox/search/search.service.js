'use strict';

angular.module('musicappApp')
  .factory('Search', function ($http) {
    var search = {
      get: get
    }

    return search;

    function get(query, category) {
      var url = '/api/search/' + query;
      if (category) {
        url += '&category=' + category;
      }
      return $http.get(url).then(response => response.data);
    }
  });
