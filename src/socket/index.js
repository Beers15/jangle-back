const Message = require('../models/message');

let users = new Map();

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('join', ({ room, username }) => {
      //ensures a single socket can only be in one room at a time
      socket.rooms.forEach((room) => {
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

    socket.on('message', async (payload) => {
      try {
        let message = await addMessage(payload);
        console.log('NEW MESSAGE:', message);
        console.log('payload', payload);
        io.to(payload.roomname).emit('message', payload);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('get-users-for-room', ({ room }) => {
      let usersInRoom = [...users].filter(
        ([, value]) => value.currentRoom === room
      );

      console.log(room, ': Current Users ->', usersInRoom);
      io.to(room).emit('get-users-for-room', { users: usersInRoom });
    });

    socket.on('disconnect', () => {
      let leavingUser = [...users].find(
        ([, value]) => value.socketId === socket.id
      );
      if (leavingUser) users.delete(leavingUser[0]);
    });
  });
};

const addMessage = async (message) => {
  try {
    let result = await Message.create(message);
    return result;
  } catch (err) {
    console.log(err);
  }
};
