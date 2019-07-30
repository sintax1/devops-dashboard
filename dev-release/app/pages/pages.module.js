/**
 * @author Craig K
 * created on 23 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.pages', [
    'DevopsDashboard.pages.dashboard'
  ])
  .config(routeConfig);

  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');
  };

})();
