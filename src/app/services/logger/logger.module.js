(function () {
  'use strict';

  angular.module('DevopsDashboard.services.logger', [])

    // Output Logger Service
    /** @ngInject */
    .service('Logger', ['DBLogger', function(DBLogger){

        this.info = function(log) {
            // Log to console
            var log_entry = {type: 'info', widget: log.widget, command: log.command, output: log.output};

            // Log to console
            console.info(log_entry);

            // Log to database
            var log = new DBLogger(log_entry);

            log.$save(function() {
              // Log saved
            });
        }

        this.error = function(log) {
            var log_entry = {type: 'error', widget: log.widget, command: log.command, output: log.output};

            // Log to console
            console.error(log_entry);

            // Log to database
            var log = new DBLogger(log_entry);

            log.$save(function() {
              // Log saved
            });
        }

        this.getLogs = function() {
          return DBLogger.query().$promise;
        }

    }])

})();
