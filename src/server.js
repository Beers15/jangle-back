const express = require('express');
const app = express();
const { createServer } = require('http');
const httpServer = createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { Server } = require('socket.io');
const roomRoutes = require('./routes/rooms');

const io = new Server(httpServer, {
  cors: {},
});

mongoose.connect(`${process.env.DATABASE_URI}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Successfully connected to Mognodb'));

require('./socket')(io);
app.use(cors());
app.use(express.json());

app.use('/rooms', roomRoutes);

module.exports = {
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    httpServer.listen(port, () => console.log(`Listening on ${port}`));
  },
};
