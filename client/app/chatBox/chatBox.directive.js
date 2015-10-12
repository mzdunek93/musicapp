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
        chat.windows = [];
        chat.toggleWindow = toggleWindow;

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
          });
        });

        function toggleWindow(user) {
          if(chat.windows.length >= 4) return;
          user.active = !user.active;
          if(user.active) {
            chat.windows.push({username: user.username, messages: []});
          } else {
            chat.windows = chat.windows.filter(window => window.username != user.username);
          }
          console.log(chat.windows)
        }
      },
      controllerAs: 'chat'
    };
  });
