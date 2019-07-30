/**
 * @author C Koroscil
 * created on 10MAY2017
 */
(function () {
  'use strict';

  angular.module('DevopsDashboard.theme.components')
      .controller('MsgCenterCtrl', MsgCenterCtrl);

  /** @ngInject */
  function MsgCenterCtrl($scope, $sce, $timeout) {
    var users = $scope.users = {};
    var notifications = $scope.notifications = [];
    var messages = $scope.messages = [];

    var socket = io('/msgcenter');

    /* Disabled since messages are pushed from server on connect
    socket.on('connect', function(){
      socket.emit('getmessages');
      socket.emit('getnotifications');
    });
    */

    /* Receive multiple messages  */
    socket.on('messages', function(data) {
      // fix for messages.length not updating properly on dashboard.
      $timeout(function() {
        angular.copy(data.messages, messages);
      });
    });

    /* Receive message  */
    socket.on('message', function(data) {
      $timeout(function() {
        // fix for messages.length not updating properly on dashboard.
        messages.push(data.message);
      });
    });

    /* Receive multiple notifications  */
    socket.on('notifications', function(data) {
      // fix for messages.length not updating properly on dashboard.
      $timeout(function() {
        angular.copy(data.notifications, notifications);
      });
    });

    /* Receive notification  */
    socket.on('notify', function(msg) {
      // fix for notifications.length not updating properly on dashboard.
      $timeout(function() {
        notifications.push(msg);
      });
    });

    /* Mark all notifications as read  */
    var clearNotifications = function() {
      socket.emit('clearnotifications');
    };

    /* Request all notifications  */
    var getNotifications = function() {
      socket.emit('getnotifications');
    };

    /* Mark all messages as read  */
    var clearMessages = function() {
      socket.emit('clearmessages');
    };

    /* Request all messages  */
    var getMessages = function() {
      socket.emit('getmessages');
    };

    $scope.allMessages = function() {
      getMessages();
    };

    $scope.allNotifications = function() {
      getNotifications();
    };

    $scope.clearMessages = function() {
      clearMessages();
    };

    $scope.clearNotifications = function() {
      clearNotifications();
    };

    $scope.getMessage = function(msg) {
      var text = msg.text;
      //if (msg.userId || msg.userId === 0) {
      //  text = text.replace('&name', '<strong>' + $scope.users[msg.userId].name + '</strong>');
      //}
      return $sce.trustAsHtml(text);
    };
  }
})();
