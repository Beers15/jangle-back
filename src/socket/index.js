module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('join', ({ room, username }) => {
      //ensures a single socket can only be in one room at a time
      socket.rooms.forEach(room => {
        socket.leave(room);
      });

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
        io.to(room).emit('message', { username: socket.id, message, room });
      } catch (err) {
        console.log(err);
      }
    });
  });
};
