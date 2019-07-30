(function () {
  'use strict';

  angular.module('DevopsDashboard.pages.userPages', ['DevopsDashboard.services.userstorage'])

    // Controller
    /** @ngInject */
    .controller('UserPagesCtrl', function ($scope, User, UserStorage) {

      $scope.dashboards = [];

      // Create list of all pages for this user
      UserStorage.query(function(data) {
        data.forEach( function(dashboard) {
          //var name = dashboard.name;
          if (('name' in dashboard) && (('model' in dashboard) && ('title' in dashboard.model))) {
            $scope.dashboards.push({name: dashboard.name, title: dashboard.model.title});
          }
        });
      });
    })

    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('userpages', {
        url: '/userpages',
        templateUrl: 'app/pages/userPages/userPages.html',
        title: 'My Dashboards',
        controller: 'UserPagesCtrl',
        sidebarMeta: {
          order: 1,
          icon: 'ion-android-document'
        },
      });
  }

})();
