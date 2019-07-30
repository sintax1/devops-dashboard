(function(window, undefined) {'use strict';


angular.module('DevopsDashboard.widget.messageservice', ['adf.provider', 'ui.select'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('messageservice', {
        title: 'Message Service',
        description: 'Send notifications and messages to the Dashboard users',
        authorizedGroups: ['root9B DevOps'],
        templateUrl: 'app/widgets/messageservice/src/view.html',
        edit: {
          templateUrl: 'app/widgets/messageservice/src/edit.html'
        }
      });
  }])
  .controller('MsgServiceCtrl', ["$scope", "$timeout", function($scope, $timeout) {
    var socket = io('/msgcenter');
    var vm = this;

    vm.disabled = undefined;
    vm.msgType = {};
    vm.msgTypes = [
      {label: 'Message', value: 'message'},
      {label: 'Notification', value: 'notification'}
    ];
    vm.recipient = {};
    vm.recipients = [];
    vm.message = "Your message here";

    vm.sendMsg = function() {
      var to = [];
      angular.forEach(vm.recipient.selected, function(uid) {
        to.push(uid.value);
      }); 

      var message = {
        to: to,
        text: vm.message
      };

      if (vm.msgType.selected.value === 'message') {
        socket.emit('addmessage', message);
      } else if (vm.msgType.selected.value === 'notification') {
        socket.emit('addnotification', message);
      }
    };

    socket.on('error', function(error) {
      console.error('Error:', error);
    });

    socket.on('users', function(data) {
      console.log('updating users', data.users);

      vm.recipients.length = 0;

      data.users.forEach(function(user) {
        vm.recipients.push({
          label: user,
          value: user
        });          
      });
      console.log(vm.recipients);
    });

  }]);

angular.module("DevopsDashboard.widget.messageservice").run(["$templateCache", function($templateCache) {$templateCache.put("app/widgets/messageservice/src/edit.html","<form role=form></form>");
$templateCache.put("app/widgets/messageservice/src/view.html","<div class=ng-cloak ng-controller=\"MsgServiceCtrl as vm\"><div class=form-group><label>Message Type</label><ui-select ng-model=vm.msgType.selected class=\"btn-group bootstrap-select form-control\" ng-disabled=false append-to-body=true search-enabled=false><ui-select-match placeholder=\"Message Type\"><span>{{$select.selected.label}}</span></ui-select-match><ui-select-choices repeat=\"msgType in vm.msgTypes | filter: $select.search\"><span ng-bind-html=msgType.label></span></ui-select-choices></ui-select></div><div class=form-group><label>Recipients</label><ui-select multiple ng-model=vm.recipient.selected ng-disabled=false search-enabled=true append-to-body=true class=form-control><ui-select-match placeholder=Recipients>{{$item.label}}</ui-select-match><ui-select-choices repeat=\"recipient in vm.recipients | filter: $select.search\">{{recipient.label}}</ui-select-choices></ui-select></div><div class=form-group><label for=message>Message</label> <textarea placeholder=Message ng-model=vm.message class=form-control id=message></textarea></div><div class=form-group><div class=button-wrapper><button type=button class=\"btn btn-success\" ng-click=vm.sendMsg()>Send</button></div></div></div>");}]);})(window);
