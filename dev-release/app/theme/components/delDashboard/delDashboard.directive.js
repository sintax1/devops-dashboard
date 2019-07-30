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
      //templateUrl: 'app/theme/components/addDashboard/addDashboard.html',
      template: '<a href="" style="float: left;padding-right: 5px; padding-left: 0px;" ng-click="remDashboard(subitem.name)"><i class="ion-minus-circled"></i></a>',
      controller: 'DelDashboardCtrl'
      /*
      controller: function($scope) {
        $scope.remDashboard = function(name) {
          console.log('remDashboard name:', name);
        }
      }*/
    };
  }

})();
