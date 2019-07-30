(function () {
  'use strict';

  angular.module('DevopsDashboard.services.user', ['ngResource'])

    // User Data Service
    /** @ngInject */
    .factory('User', ['$resource', function($resource){
      return $resource('/user/:id', null, {
        'query':  {method:'GET', isArray:false},
        'update': { method:'PUT' }
      });
    }])

})();
