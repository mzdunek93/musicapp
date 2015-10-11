'use strict';

angular.module('musicappApp')
  .directive('chatBox', function () {
    return {
      templateUrl: 'app/chatBox/chatBox.html',
      restrict: 'E',
      link: function (scope, element, attrs) {

      },
      controller: function($scope, Auth, socket) {
        var chat = this;
        chat.users = [];

        $scope.$watch(() => Auth.getCurrentUser(), function(currentUser) {
          chat.currentUser = currentUser;
        });

        $scope.$watch(() => chat.users, function(users) {
          chat.show = users.length > 0;
        });

        Auth.getFriends(function(users) {
          chat.users = users;
          socket.syncUpdates('user', chat.users, function(event, item, users) {
            chat.users = users.filter(user => user.friends.indexOf(chat.currentUser._id) >= 0);
            if (item._id === chat.currentUser._id) {
              Auth.setCurrentUser(item);
            }
            console.log(users)
          });
        });
      },
      controllerAs: 'chat'
    };
  });
