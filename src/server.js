const express = require('express');
const app = express();
const { createServer } = require('http');
const httpServer = createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { Server } = require('socket.io');
const roomRoutes = require('./routes/rooms');
const profileRoutes = require('./routes/profiles');
const messageRoutes = require('./routes/messages');

const io = new Server(httpServer, {
  cors: {},
});

let connectionString = process.env.DATABASE_URI;
if (process.env.NODE_ENV === 'test') {
  connectionString = global.__MONGO_URI__;
}

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Successfully connected to MongoDB'));

require('./socket')(io);
app.use(cors());
app.use(express.json());

app.use('/rooms', roomRoutes);
app.use('/profiles', profileRoutes);
app.use('/messages', messageRoutes);

module.exports = {
  app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    httpServer.listen(port, () => console.log(`Listening on ${port}`));
  },
};
