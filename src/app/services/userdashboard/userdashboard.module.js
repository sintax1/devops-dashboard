(function () {
  'use strict';

  angular.module('DevopsDashboard.services.userdashboard', ['ngResource'])

    // User Dashboard Service
    /** @ngInject */
    .factory('UserDashboard', ['$resource', function($resource){
      return $resource('/dashboards/:name', {}, {
        update: {method:'PUT'}
      });
    }])

})();
