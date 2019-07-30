/**
 * @author Craig K
 * created on 27 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .directive('addDashboard', addDashboard);

  /** @ngInject */
  function addDashboard() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/addDashboard/addDashboard.html',
      controller: 'AddDashboardCtrl'
    };
  }

})();
