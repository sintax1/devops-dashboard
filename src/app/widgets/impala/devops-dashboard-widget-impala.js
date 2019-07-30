(function(window, undefined) {'use strict';


angular.module('DevopsDashboard.widget.impala', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('impala', {
        title: 'Impala Query',
        description: 'Used to query Cloudera through Impala',
        authorizedGroups: ['myorg_all'],
        templateUrl: 'app/widgets/impala/src/view.html',
        edit: {
          templateUrl: 'app/widgets/impala/src/edit.html'
        },
        controller: 'ImpalaCtrl'
      });
  }])

  .factory('ImpalaClient', ['$resource', function($resource){
    return $resource('/impala', null, {
      'query':  {method:'POST', params:{query: '@query'}}
    });
  }])

  .controller('ImpalaCtrl', ["$scope", "ImpalaClient", function($scope, ImpalaClient) {
    $scope.searchString = "";
    $scope.results = "";

    $scope.search = function() {
      ImpalaClient.query({query:$scope.searchString}, function(results) {
        $scope.results = results;
      });
    }

  }]);


angular.module("DevopsDashboard.widget.impala").run(["$templateCache", function($templateCache) {$templateCache.put("app/widgets/impala/src/edit.html","");
$templateCache.put("app/widgets/impala/src/view.html","<div class=form-group><label for=query>Query String</label> <textarea placeholder=\"SELECT column_name FROM table_name\" ng-model=searchString class=form-control id=query></textarea></div><div class=form-group><div class=button-wrapper><button type=button class=\"btn btn-success\" ng-click=search()>Search</button></div></div><pre>{{results | json}}</pre>");}]);})(window);
