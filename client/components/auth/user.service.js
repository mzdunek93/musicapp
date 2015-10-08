'use strict';

angular.module('musicappApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      getUser: {
        method: 'GET',
        params: {
          controller:'show'
        }
      },
      invite: {
        method: 'GET',
        params: {
          controller:'invite'
        }
      },
      uninvite: {
        method: 'GET',
        params: {
          controller:'uninvite'
        }
      },
      unfriend: {
        method: 'GET',
        params: {
          controller:'unfriend'
        }
      }
	  });
  });
