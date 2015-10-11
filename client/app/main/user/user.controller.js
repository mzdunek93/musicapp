'use strict';

angular.module('musicappApp')
  .controller('UserCtrl', function (displayedUser, Auth, $scope) {
    var user = this;

    user.username = displayedUser.username;

    $scope.$watch(() => Auth.getCurrentUser(), function(currentUser) {
      user.isFriend = currentUser.friends.indexOf(displayedUser._id) >= 0;
      user.isInvited = currentUser.invited.indexOf(displayedUser._id) >= 0;
      user.isInviting = currentUser.inviting.indexOf(displayedUser._id) >= 0;
      user.isNotInvited = !user.isFriend && !user.isInvited;
      user.isCurrentUser = displayedUser._id === currentUser._id;
    });

    user.addToFriends = addToFriends;
    user.cancelInvitation = cancelInvitation;
    user.acceptInvitation = acceptInvitation;
    user.rejectInvitation = rejectInvitation;
    user.unfriend = unfriend;

    function addToFriends() {
      Auth.invitation('invite', displayedUser, function(user) {
        Auth.setCurrentUser(user);
      });
    }

    function cancelInvitation() {
      Auth.invitation('uninvite', displayedUser, function(user) {
        Auth.setCurrentUser(user);
      });
    }

    function acceptInvitation() {
      Auth.invitation('accept', displayedUser, function(user) {
        Auth.setCurrentUser(user);
      });
    }

    function rejectInvitation() {
      Auth.invitation('reject', displayedUser, function(user) {
        Auth.setCurrentUser(user);
      });
    }

    function unfriend() {
      Auth.invitation('unfriend', displayedUser, function(user) {
        Auth.setCurrentUser(user);
      });
    }
  });
