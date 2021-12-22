let users = new Map();

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
          users.set(username, { socketId: socket.id, currentRoom: room });
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

    socket.on('get-users-for-room', ({ room }) => {
      let usersInRoom = new Map(
        [...users]
        .filter(([, value]) => value.currentRoom === room )
      );
      console.log(room, 'has the users ', usersInRoom);
      io.to(room).emit('get-users-for-room', { users: usersInRoom });
    });

    socket.on('disconnect', () => {
      let leavingUser = [...users].find(([, value]) => {
        return value.socketId === socket.id
      });
      users.delete(leavingUser[0]);
    });
  });
};
