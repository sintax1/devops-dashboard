/**
 * @author Craig K
 * created on 27 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .directive('delDashboard', delDashboard);

  /** @ngInject */
  function delDashboard() {
    return {
      restrict: 'E',
      template: '<a href="" style="float: left;padding-right: 5px; padding-left: 0px;" ng-click="remDashboard(subitem.name)"><i class="ion-minus-circled"></i></a>',
      controller: 'DelDashboardCtrl'
    };
  }

})();
