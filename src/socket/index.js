module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('join', ({ room, username }) => {
      try {
        socket.join(room);
        if (username) {
          socket.username = username;
        }
        console.log(
          `${socket.username} (${socket.id}) just joined room [${room}]`
        );
        io.to(room).emit('user-connected', socket.username);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('message', ({ message, room }) => {
      try {
        console.log({ message, room });
        io.to(room).emit('message', { username: socket.id, message });
      } catch (err) {
        console.log(err);
      }
    });
  });
};
