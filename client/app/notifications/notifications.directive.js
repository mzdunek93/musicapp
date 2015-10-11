'use strict';

angular.module('musicappApp')
  .directive('notifications', function () {
    return {
      templateUrl: 'app/notifications/notifications.html',
      restrict: 'E',
      replace: true,
      controllerAs: 'notifications',
      controller: function ($scope, Auth) {
        var notifications = this;

        notifications.show = false;

        notifications.toggle = toggle;
        notifications.isLoggedIn = Auth.isLoggedIn;
        notifications.acceptInvitation = acceptInvitation;
        notifications.rejectInvitation = rejectInvitation;

        $scope.$watch(() => Auth.getCurrentUser(), function(currentUser) {
          notifications.present = currentUser.notifications.length > 0;
          notifications.list = currentUser.notifications;
          notifications.number = currentUser.notifications.length;
        });

        function toggle() {
          notifications.show = !notifications.show;
        }

        function acceptInvitation(userId) {
          Auth.invitation('accept', {_id: userId}, function(user) {
            Auth.setCurrentUser(user);
          });
        }

        function rejectInvitation(userId) {
          Auth.invitation('reject', {_id: userId}, function(user) {
            Auth.setCurrentUser(user);
          });
        }
      }
    };
  });
