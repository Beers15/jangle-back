const { describe, expect, test } = require('@jest/globals');
const request = require('supertest');
const { server } = require('../src/server');
const mongoose = require('mongoose');

const agent = request.agent(server);

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('room routes', () => {
  test('can create a room', async () => {
    let response = await agent.post('/rooms').send({ roomname: 'jest' });
    expect(response.body.roomname).toBe('jest');
  });

  test('get all rooms from /rooms route', async () => {
    let response = await agent.get('/rooms');
    // console.log(response.body);
    expect(response.body[0].roomname).toBe('jest');
  });

  test('can delete a room', async () => {
    let rooms = await agent.get('/rooms');
    let id = rooms.body[0]._id;
    let response = await agent.delete(`/rooms/${id}`);
    expect(response.body).toMatchObject({});
  });
});

