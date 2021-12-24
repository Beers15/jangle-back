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
        let message = await addMessage(payload)
        console.log('NEW MESSAGE:', message);
        io.to(payload.roomname).emit('message', message);
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
      if(leavingUser)
        users.delete(leavingUser[0]);
    });
  });
};

const addMessage = async (message) => {
  let msg = message	
  let current = new Date();
  let date = `${current.getFullYear()}/${(current.getMonth() + 1)}/${current.getDate()}`;
  let time = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
  msg.timeSentFormatted =  `${date} ~ ${time}`;
  msg.timeSent = current;

  try {
    let result = await Message.create(msg);
    return result;
  } catch (err) {
    console.log(err)
  }
}
