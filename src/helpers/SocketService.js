module.exports = io => {
  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('DriverLocation', function (msg) {
      socket.broadcast.emit('DriverLocation', msg);
    });

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
};