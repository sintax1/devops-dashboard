/**
 * @author Craig K
 * created on Apr 23 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.services', [
    'DevopsDashboard.services.userstorage',
    'DevopsDashboard.services.userdashboard',
    'DevopsDashboard.services.user',
    'DevopsDashboard.services.sidebar',
    'DevopsDashboard.services.dblogger',
    'DevopsDashboard.services.logger',
    'DevopsDashboard.services.websocket'
  ]);

})();
