/**
 * @author Craig K
 * created on 27 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .controller('AddDashboardCtrl', AddDashboardCtrl);

  /** @ngInject */
  function AddDashboardCtrl($scope, UserDashboard, SidebarService) {

    var model = {
      title: "New Dashboard",
      structure: "6-6",
    };

    $scope.addDashboard = function() {
      var name = 'Dashboard-' + new Date().valueOf();
      UserDashboard.update({name: name, model: model}, function() {
        SidebarService.refreshMenu();
      });
    };
  }
})();
