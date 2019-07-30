/* Websocket */
module.exports = function(io) {

  // Setup socket on io connection
  io.on('connection', function (socket) {
    console.log('connection start');

    socket.on('disconnect', function () {
      console.log('disconnected');
    });

    socket.on('websockettest.ping', function (msg) {
      console.log('websockettest.ping:', msg);
      socket.emit('websockettest.pong', { data: 'pong' });
    });

    socket.on('websockettest.pong', function (msg) {
      console.log('websockettest.pong:', msg);
    });

    // Event Emitters
    socket.emit('websockettest.ping', { data: 'ping' });

  });

}
