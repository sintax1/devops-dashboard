/* Websocket - MsgCenter*/
module.exports = function(io) {

  var all_messages = {};
  var all_notifications = {};
  var userClients = {};

  /*
  var all_messages = [{
    from: uid,
    read: false,
    text: 'After you get up and running, you can place Font Awesome icons just about...',
    time: '1 week ago'
  }];

  var all_notifications = [{
    from: uid,
    read: false,
    template: 'New comments on your post.',
    time: '1 min ago'
  }];
  */

  // Create msgcenter namespace
  var wsMsgCenter = io.of('/msgcenter');

  wsMsgCenter.on('connection', function(socket){

    if (socket.request.user.uid in userClients) {
      userClients[socket.request.user.uid].push(socket.id);
    } else {
      userClients[socket.request.user.uid] = [socket.id];
    }

    /* Event Handlers */

    socket.on('disconnect', function() {
      var uid = socket.request.user.uid;
      var connid = socket.id;

      // Remove the connection from client list
      if (uid in userClients) {
        var index = userClients[uid].indexOf(connid);
        if (index > -1) {
          userClients[uid].splice(index, 1);
        }
        if (userClients[uid].length > 0) {
          delete userClients[uid];
        }
      }

      // Announce all connected users since user disconnected
      broadcastConnectedUsers(socket)
    });

    socket.on('getnotifications', function() {
      markAllAsUnread(socket.request.user.uid, all_notifications);
      sendNotifications(socket, socket.request.user.uid);
    });

    socket.on('clearnotifications', function() {
      markAllAsRead(socket.request.user.uid, all_notifications);
      sendNotifications(socket, socket.request.user.uid);
    });

    socket.on('getmessages', function() {
      markAllAsUnread(socket.request.user.uid, all_messages);
      sendMessages(socket, socket.request.user.uid);
    });

    socket.on('clearmessages', function() {
      markAllAsRead(socket.request.user.uid, all_messages);
      sendMessages(socket, socket.request.user.uid);
    });

    socket.on('addnotification', function(msg) {
      addNotification(socket, socket.request.user.uid, msg);
    });

    socket.on('addmessage', function(msg) {
      addMessage(socket, socket.request.user.uid, msg);
    });

    // New user connected. Send list of users, messages, and notifications
    setTimeout(function() {
      broadcastConnectedUsers(socket);
      sendNotifications(socket, socket.request.user.uid);
      sendMessages(socket, socket.request.user.uid);
    },1000);
  });


  /* Helper Functions */

  /* Send the list of currently connected users to everyone */
  var broadcastConnectedUsers = function(socket) {
    var users = getConnectedUsers();
    socket.broadcast.emit('users', { users: users });
  };

  /* Mark all messages as read */
  var markAllAsRead = function(uid, messages) {
    setAllMessageStatus(uid, messages, true);
  };

  /* Mark all messages as unread */
  var markAllAsUnread = function(uid, messages) {
    setAllMessageStatus(uid, messages, false);
  };

  var setAllMessageStatus = function(uid, messages, status) {
    if (uid in messages) {
      var msgs = messages[uid];
      msgs.forEach(function(msg) {
        msg.read = status;
      });
    }
  };

  /* Get all unread messages */
  var getUnreadMessages = function(uid, messages) {
    var unreadmsgs = [];
    if (uid in messages) {
      messages[uid].forEach(function(msg) {
        if (msg.read != true) {
          unreadmsgs.push(msg);
        }
      });
    }
    return unreadmsgs;
  };

  /* Send all messages to a user */
  var sendMessages = function(socket, to_uid) {
    var uids = [].concat(to_uid);

    uids.forEach(function(uid) {
      var unreadmsgs = getUnreadMessages(uid, all_messages);

      if (uid in userClients) {
        userClients[uid].forEach(function(connid) {
          if (socket.id === connid) {
            // Can't broadcast to same socket. instead just emit to the socket
            socket.emit('messages', { messages: unreadmsgs });
          } else {
            socket.broadcast.to(connid).emit('messages', { messages: unreadmsgs });
          }
        });
      }
    });
  };

  /* Send all notifications to a user */
  var sendNotifications = function(socket, to_uid) {
    var uids = [].concat(to_uid);

    uids.forEach(function(uid) {
      var unreadmsgs = getUnreadMessages(uid, all_notifications);

      if (uid in userClients) {
        userClients[uid].forEach(function(connid) {
          if (socket.id === connid) {
            socket.emit('notifications', { notifications: unreadmsgs });
          } else {
            socket.broadcast.to(userClients[uid]).emit('notifications', { notifications: unreadmsgs });
          }
        });
      }
    });
  };

  /* Send single notification to a user */
  var sendNotification = function(socket, uid, msg) {
    if (uid in userClients) {
      userClients[uid].forEach(function(connid) {
        if (socket.id === connid) {
          socket.emit('notification', { notification: msg });
        } else {
          socket.broadcast.to(connid).emit('notification', { notification: msg });
        }
      });
    }
  };

  /* Send single message to a user */
  var sendMessage = function(socket, uid, msg) {
    if (uid in messages) {
      userClients[uid].forEach(function(connid) {
        if (socket.id === connid) {
          socket.emit('message', { message: msg });
        } else {
          socket.broadcast.to(connid).emit('message', { message: msg });
        }
      });
    }
  };

  /* Add a single message to the list */
  var addMessage = function(socket, from_uid, msg) {
    addToAllMessages(from_uid, msg, all_messages);
    sendMessages(socket, msg.to);
  };

  /* Add a single notification to the list */
  var addNotification = function(socket, from_uid, msg) {
    addToAllMessages(from_uid, msg, all_notifications);
    sendNotifications(socket, msg.to);
  };

  var addToAllMessages = function(from_uid, msg, messages) {
    var message = {
      from: from_uid,
      time: new Date(),
      read: false,
      text: msg.text
    };

    var recipients = [].concat(msg.to);

    recipients.forEach(function(recipient) {
      if (recipient in messages) {
        messages[recipient].push(message);
      } else {
        messages[recipient] = [message];
      }
    });
  };

  /* Add a notification to all users */
  var addNotificationToAllUsers = function(msg) {
    var users = Object.keys(userClients);

    users.forEach(function(uid) {
      addNotification(uid, msg);
    });
  };

  /* Add a message to all users */
  var addMessageToAllUsers = function(socket, msg) {
    var users = Object.keys(userClients);

    users.forEach(function(uid) {
      addMessage(socket, uid, msg);
    });
  };

  /* Get a list of all users currently connected */
  var getConnectedUsers = function() {
    return Object.keys(userClients);
  };

}
