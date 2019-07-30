(function(window, undefined) {'use strict';


angular.module('DevopsDashboard.widget.logviewer', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('logviewer', {
        title: 'Log Viewer',
        description: 'View Dashboard logs',
        authorizedGroups: ['myorg_all'],
        templateUrl: '{widgetsPath}/logviewer/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/logviewer/src/edit.html'
        },
        controller: 'logDataCtrl'
      });
  }])
  .controller('logDataCtrl', ["$scope", "$timeout", "User", "Logger", function($scope, $timeout, User, Logger) {

    $scope.smartTableData = [];     // Resulting data set after search, filter, etc.
    $scope.smartTableDataSrc = [];  // Original raw data set
    $scope.smartTablePageSize = 10;

    var refreshLogs = $scope.refreshLogs = function() {

      Logger.getLogs().then( function(logs) {
        /*
        angular.forEach(logs, function(log) {
          log.output = JSON.stringify(log.output);
          this.push(log);
        }, $scope.smartTableDataSrc);
        */

        $scope.smartTableDataSrc = logs;

        // Initialize the rows per page select menu
        $('.selectpicker').selectpicker('refresh');
      });
    };

    refreshLogs();

  }]);

angular.module("DevopsDashboard.widget.logviewer").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/logviewer/src/edit.html","<form role=form><div class=form-group></div></form>");
$templateCache.put("{widgetsPath}/logviewer/src/view.html","<div class=row><span class=pull-right style=padding-right:10px;><a href=# title=\"Refresh logs\" ng-click=refreshLogs()><i class=\"glyphicon glyphicon-refresh\"></i></a></span><div class=col-md-12><div class=horizontal-scroll><div class=\"form-group select-page-size-wrap\"><label>Rows per page<select class=\"form-control selectpicker show-tick\" title=\"Rows per page\" selectpicker ng-model=smartTablePageSize ng-options=\"i for i in [5,10,15,20,25]\"></select></label></div><table class=table st-table=smartTableData st-safe-src=smartTableDataSrc><thead><tr class=sortable><th st-sort=updated_at st-sort-default=true>Date</th><th st-sort=widget>Widget</th><th st-sort=type>Type</th><th st-sort=command>Command</th><th st-sort=output>Output</th></tr><tr><th colspan=5><input st-search class=form-control placeholder=\"Search ...\" type=text></th></tr></thead><tbody><tr ng-repeat=\"log in smartTableData\"><td>{{log.updated_at}}</td><td>{{log.widget}}</td><td>{{log.type}}</td><td>{{log.command}}</td><td>{{log.output}}</td></tr></tbody><tfoot><tr><td colspan=5 class=text-center><div st-pagination st-items-by-page=smartTablePageSize st-displayed-pages=5></div></td></tr></tfoot></table></div></div></div>");}]);})(window);
