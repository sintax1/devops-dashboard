(function () {
  'use strict';

  angular.module('DevopsDashboard.services.sidebar', ['ngResource', 'DevopsDashboard.services.userstorage'])

    // User Sidebar Menu Service
    /** @ngInject */
    .factory('SidebarService', function($resource, UserStorage){

      var service = {};
      service.menuItems = [];

      var addMenuItem = function(name, title) {
        if(!(name === "Dashboard")) {
          if (0 == service.menuItems.length) {
            service.menuItems.push({title: 'My Dashboards', icon: 'ion-document'});
          };
          if (!('subMenu' in service.menuItems[0])) {
            service.menuItems[0].subMenu = [];
          };
          if(!lookup(service.menuItems[0].subMenu, name)) {
            service.menuItems[0].subMenu.push({name: name, title: title, fixedHref: '#/dashboard/' + name});
          };
        };
      };

      var refreshMenu = function() {
        service.menuItems.splice(0, service.menuItems.length);
        UserStorage.query(function(data) {
          data.forEach( function(dashboard) {
            if (('name' in dashboard) && (('model' in dashboard) && ('title' in dashboard.model))) {
              if (name != "Dashboard") {
                addMenuItem(dashboard.name, dashboard.model.title);
              };
            }
          });
        });
      };

      var lookup = function(arr, value) {
        for (var i = 0, len = arr.length; i < len; i++) {
          if (arr[i].name === value) {
            return true;
          }
        }
        return false;
      }

      service.addMenuItem = addMenuItem;
      service.refreshMenu = refreshMenu;

      refreshMenu();

      return service;
    });

})();
