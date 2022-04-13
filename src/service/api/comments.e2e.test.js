'use strict';

const {
  ResponseStatus
} = require(`../../constants`);
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const testDB = require(`../lib/test-db`);

const commentsRouter = require(`./comments`);
const CommentDataService = require(`../data-service/comment`);

const categories = [`Автомобили`];

const createAPI = async () => {
  const app = express();
  app.use(express.json());

  const sequelize = new Sequelize(`sqlite::memory:`, {logging: false});
  await testDB(sequelize, {categories});
  commentsRouter(app, new CommentDataService(sequelize));
  return app;
};

describe(`API returns comments list`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/comments`)
  });


  test(`Return all comments status 200`, () => expect(response.statusCode).toBe(ResponseStatus.SUCCESS));
});

describe(`API returns comments list by user id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/comments/user/1`)
  });


  test(`Return all comments by user id status 200`, () => expect(response.statusCode).toBe(ResponseStatus.SUCCESS));
});

describe(`API create comment`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/comments`)
      .send({
        userId: 1,
        publicationId: 1,
        message: `A am test message for current article`
      })
  });


  test(`Return create status 201`, () => expect(response).toBe(ResponseStatus.SUCCESS_CREATE));
});

describe(`API create comment bad request`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/comments`)
      .send({
        userId: 1,
        publicationId: 1
      })
  });


  test(`Return create status 400`, () => expect(response.statusCode).toBe(ResponseStatus.BAD_REQUEST));
});

