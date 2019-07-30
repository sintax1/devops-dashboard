(function () {
  'use strict';

  angular.module('DevopsDashboard.pages.dashboard', [
    'adf', 'adf.structures.base', 'DevopsDashboard.services.user', 
    'DevopsDashboard.services.userdashboard', 'DevopsDashboard.services.sidebar'])

    // Controller
    /** @ngInject */
    .controller('DashboardCtrl', function ($scope, $state, $stateParams, User, UserDashboard, SidebarService) {
      var name = ('name' in $stateParams && $stateParams.name) ? $stateParams.name : 'Dashboard';

      // Populate the Dashboard page
      UserDashboard.get({name: name}, function(data) {
        var model = data.model;

        if (!model) {
          // set default model
          model = {
            title: "Dashboard",
            structure: "6-6/12",
            titleTemplateUrl: "app/pages/dashboard/custom-dashboard-title.html",
            rows: [{
              columns: [{
                styleClass: "col-md-6",
                widgets: [{
                  title: 'VirusTotal',
                  type: 'virustotal'
                }]
              }, {
                styleClass: "col-md-6",
              }]
            }, {
              columns: [{
                widgets: [{
                  title: 'Log Viewer',
                  type: 'logviewer'
                }]
              }]
            }]
          };
        }
        $scope.model = model;
      });

      $scope.name = name;
      $scope.collapsible = true;
      $scope.maximizable = false;
      $scope.enableConfirmDelete = true;
      $scope.categories = false;

      var userGroups = [];

      User.query( function(user) {
        //userGroups = user.memberOf || ['CN=myorg_all,OU=Global Security Groups,OU=Accounts,DC=myorg,DC=com'];
        userGroups = user.memberOf;
      });

      // Filter widgets so only those authorized appear
      $scope.widgetFilter = function(widget, type) {
        var authorized = false;

        if ('authorizedGroups' in widget) {
          widget.authorizedGroups.forEach( function(group) {
            var groupString = 'CN=' + group + ',OU=Global Security Groups,OU=Accounts,DC=myorg,DC=com';

            if ( !(userGroups) || userGroups.includes(groupString)) {
              authorized = true;
            }
          });
        } else {
          // Let everyone access widgets that don't have authorizedGroups field
          authorized = true;
        }
        return authorized;
      };

      // set our custom widget title template when widgets are added
      $scope.$on('adfWidgetAdded',function(event, name, model, widget){
        //widget.titleTemplateUrl="partials/custom-widget-title.html";
      });

      $scope.$on('adfDashboardChanged', function(event, name, model) {
        UserDashboard.update({name: name, model: model}, function() {
          SidebarService.refreshMenu();
        });
      });

    })


    // Configuration
    .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, dashboardProvider) {
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/pages/dashboard/dashboard.html',
          controller: 'DashboardCtrl',
          title: 'Dashboard',
          sidebarMeta: {
            order: 0,
            icon: 'ion-android-home'
          },
        });

      $stateProvider
        .state('mydashboard', {
          url: '/dashboard/:name',
          title: 'My Dashboards',
          templateUrl: 'app/pages/dashboard/dashboard.html',
          controller: 'DashboardCtrl'
        });

      dashboardProvider
        .structure('1-1', {
          rows: [{
            columns: [{
              styleClass: 'col-md-12'
            }]
          }]
        })
        .structure('4-4-4', {
          rows: [{
            columns: [{
              styleClass: 'col-md-4'
            }, {
              styleClass: 'col-md-4'
            }, {
              styleClass: 'col-md-4'
            }]
          }]
        })
        .structure('6-6/12', {
          rows: [{
            columns: [{
              styleClass: 'col-md-6'
            }, {
              styleClass: 'col-md-6'
            }]
          }, {
            columns: [{
              styleClass: 'col-md-12'
            }]
          }]
        });
    }

})();

