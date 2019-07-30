/**
 * @author Craig K
 * created on 24 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .directive('userInfo', userInfo);

  /** @ngInject */
  function userInfo() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/userInfo/userInfo.html',
      controller: 'UserInfoCtrl'
    };
  }

})();
