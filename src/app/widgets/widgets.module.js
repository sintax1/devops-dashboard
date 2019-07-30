/**
 * @author Craig K
 * created on 23 Apr 2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.widgets', [
    'DevopsDashboard.widget.virustotal',
    'DevopsDashboard.widget.logviewer',
    'DevopsDashboard.widget.messageservice',
    'DevopsDashboard.widget.bizops-proposals',
    'DevopsDashboard.widget.impala'
  ]);

})();
