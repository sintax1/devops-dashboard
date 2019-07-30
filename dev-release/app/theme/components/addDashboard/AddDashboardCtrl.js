/**
 * @author Craig K
 * created on 27 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .controller('AddDashboardCtrl', AddDashboardCtrl);

  /** @ngInject */
  function AddDashboardCtrl($scope, UserStorage, SidebarService) {

    var model = {
      title: "New Dashboard",
      structure: "6-6",
    };

    $scope.addDashboard = function() {
      var name = 'Dashboard-' + new Date().valueOf();
      console.log(name);
      UserStorage.set({name: name, model: model}, function() {
        SidebarService.refreshMenu();
      });
    };
  }
})();
