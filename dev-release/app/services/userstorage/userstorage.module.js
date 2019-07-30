(function () {
  'use strict';

  angular.module('DevopsDashboard.services.userstorage', ['ngResource'])

    // User Storage Service
    /** @ngInject */
    .factory('UserStorage', ['$resource', function($resource){
      return $resource('/userstorage/:name', null, {
        'query': { method:'GET', isArray: true },
        'set': { method:'PUT' },
        'clear': { method:'DELETE' }
      });
    }])

})();
