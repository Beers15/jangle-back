const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

module.exports = {
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    httpServer.listen(port, () => console.log(`Listening on ${port}`));
  },
};
