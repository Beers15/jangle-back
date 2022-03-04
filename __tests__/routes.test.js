const { describe, expect, it } = require('@jest/globals');
const request = require('supertest');
const { app } = require('../src/server');
const mongoose = require('mongoose');
const agent = request.agent(app);

// assuming a authenticated user is hitting all routes here
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => next()));

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Tests the Room Routes', () => {
  it('Can create a room', async () => {
    let response = await agent
      .post('/rooms')
      .send({ roomname: 'jest' })
      .set('Authorization', `Bearer`);

    expect(response.body.roomname).toBe('jest');
  });

  it('get all rooms from /rooms route', async () => {
    let response = await agent
      .get('/rooms')
      

    expect(response.body[0].roomname).toBe('jest');
  });

  it('Can delete a room', async () => {
    let rooms = await agent.get('/rooms');
    let id = rooms.body[0]._id;

    let response = await agent
      .delete(`/rooms/${id}`)
      

    expect(response.body).toMatchObject({});
  });
});

describe('Tests the Profile Routes', () => {
  it('Can create a profile', async () => {
    let response = await agent
      .post('/profiles')
      .send({ username: 'foo', bio: 'my bio' })

    expect(response.body.username).toBe('foo');
    expect(response.body.bio).toBe('my bio');
  });

  it('Can get all profiles', async () => {
    let response = await agent
      .get('/profiles')   

    expect(response.body[0].username).toBe('foo');
  });

  it('Can get a specific profile', async () => {
    let response = await agent.get(`/profiles/foo`);
    expect(response.body[0].username).toBe('foo');
  });

  it.skip('Can update a specific profile', async () => {
    let response = await agent
      .put(`/profiles/foo`)
      .send({ bio: 'a new bio' })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(204);
    expect(response.body).toBe();
  });

  it('Can delete a profile', async () => {
    let response = await agent
      .delete(`/profiles/foo`)
      .set('Authorization', 'Bearer')

    expect(response.body).toMatchObject({});
  });
});

describe('Tests the Message routes', () => {
  it('Can get all messages in a room', async () => {
    await agent
      .post('/rooms')
      .send({ roomname: 'jest' })
      

    let response = await agent
      .get('/messages/jest')
      

    expect(response.body).toMatchObject([]);
  });
});
