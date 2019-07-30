/**
 * @author Craig K
 * created on 27 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .controller('DelDashboardCtrl', DelDashboardCtrl);

  /** @ngInject */
  function DelDashboardCtrl($scope, UserDashboard, SidebarService) {

    $scope.remDashboard = function(name) {
      UserDashboard.remove({name: name}, function() {
        SidebarService.refreshMenu();
      });
    };
  }
})();

