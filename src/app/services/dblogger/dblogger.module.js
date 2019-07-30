(function () {
  'use strict';

  angular.module('DevopsDashboard.services.dblogger', ['ngResource'])

    // Output Logger Service
    /** @ngInject */
    .factory('DBLogger', ['$resource', function($resource){
      return $resource('/logger/:id', null, {
        'update': { method:'PUT' },
      });
    }])

})();
