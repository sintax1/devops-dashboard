/**
 * @author Craig K
 * created on 27 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .controller('DelDashboardCtrl', DelDashboardCtrl);

  /** @ngInject */
  function DelDashboardCtrl($scope, UserStorage, SidebarService) {

    $scope.remDashboard = function(name) {
      console.log('remDashboard');
      console.log(name);
      UserStorage.remove({name: name}, function() {
        SidebarService.refreshMenu();
      });
    };
  }
})();

