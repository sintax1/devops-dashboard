/**
 * @author Craig K
 * created on 24 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .controller('UserInfoCtrl', UserInfoCtrl);

  /** @ngInject */
  function UserInfoCtrl($scope, $location, User) {
    $scope.user = User.query();

    $scope.signout = function() {
      console.log('logout');
      $location.path('/logout');
      window.location = '/logout';
    };

  }
})();
