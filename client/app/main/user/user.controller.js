'use strict';

angular.module('musicappApp')
  .controller('UserCtrl', function (displayedUser, Auth, $scope) {
    var user = this;
    var currentUser = Auth.getCurrentUser();

    user.username = displayedUser.username;
    user.isCurrentUser = displayedUser._id === currentUser._id;
    $scope.$watch(() => currentUser, function(currentUser) {
      user.isFriend = currentUser.friends.indexOf(displayedUser._id) >= 0;
      user.isInvited = currentUser.invited.indexOf(displayedUser._id) >= 0;
      user.isNotInvited = !user.isFriend && !user.isInvited;
      console.log(currentUser)
    });

    user.addToFriends = addToFriends;
    user.cancelInvitation = cancelInvitation;
    user.unfriend = unfriend;

    function addToFriends() {
      Auth.invite(displayedUser, function(user) {
        currentUser = user;
        console.log(user)
      });
    }

    function cancelInvitation() {
      Auth.uninvite(displayedUser, function(user) {
        currentUser = user;
        console.log(user)
      });
    }

    function unfriend() {
      Auth.unfriend(displayedUser, function(user) {
        currentUser = user;
      });
    }
  });
