const { describe, expect, test } = require('@jest/globals');
const request = require('supertest');
const { app } = require('../src/server');
const mongoose = require('mongoose');

const agent = request.agent(app);

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
    expect(response.body[0].roomname).toBe('jest');
  });

  test('can delete a room', async () => {
    let rooms = await agent.get('/rooms');
    let id = rooms.body[0]._id;
    let response = await agent.delete(`/rooms/${id}`);
    expect(response.body).toMatchObject({});
  });
});

describe('profile routes', () => {
  test('can create a profile', async () => {
    let response = await agent
      .post('/profiles')
      .send({ username: 'foo', bio: 'my bio' });
    expect(response.body.username).toBe('foo');
    expect(response.body.bio).toBe('my bio');
  });

  test('can get all profiles', async () => {
    let response = await agent.get('/profiles');
    expect(response.body[0].username).toBe('foo');
  });

  test('can get a specific profile', async () => {
    let response = await agent.get(`/profiles/foo`);
    expect(response.body[0].username).toBe('foo');
  });

  test.skip('can update a specific profile', async () => {
    let response = await agent
      .put(`/profiles/foo`)
      .send({ bio: 'a new bio' })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(204);
    expect(response.body).toBe();
  });

  test('can delete a profile', async () => {
    let response = await agent.delete(`/profiles/foo`);
    expect(response.body).toMatchObject({});
  });
});

describe('message routes', () => {
  test('can get all messages in a room', async () => {
    await agent.post('/rooms').send({ roomname: 'jest' });
    let response = await agent.get('/messages/jest');
    expect(response.body).toMatchObject([]);
  });
});
