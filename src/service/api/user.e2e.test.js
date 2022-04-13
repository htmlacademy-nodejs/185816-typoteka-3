'use strict';

const {
  ResponseStatus
} = require(`../../constants`);
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const testDB = require(`../lib/test-db`);

const userRouter = require(`./user`);
const UserDataService = require(`../data-service/user`);

const categories = [`Автомобили`];

const createAPI = async () => {
  const app = express();
  app.use(express.json());

  const sequelize = new Sequelize(`sqlite::memory:`, {logging: false});
  await testDB(sequelize, {categories});
  userRouter(app, new UserDataService(sequelize));
  return app;
};

describe(`API returns create user valid data`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        firstName: `test`,
        lastName: `test`,
        email: `test@test.ru`,
        password: `password`,
        avatar: `default.jpg`,
      });
  });


  test(`Return create status 201`, () => expect(response.statusCode).toBe(ResponseStatus.SUCCESS_CREATE));
});

describe(`API returns create user ivalid data`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        firstName: `test`,
        lastName: `test`,
        email: `test@test.ru`,
        avatar: `default.jpg`,
      });
  });


  test(`Return create status 400`, () => expect(response.statusCode).toBe(ResponseStatus.BAD_REQUEST));
});

describe(`API returns create user unique email`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        firstName: `test`,
        lastName: `test`,
        email: `test@t.ru`,
        password: `pswd`,
        avatar: `default.jpg`,
      });
  });


  test(`Return create status 400`, () => expect(response.statusCode).toBe(ResponseStatus.BAD_REQUEST));
});

describe(`API returns auth bad request`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send({
        email: `test@t.ru`
      });
  });


  test(`Return auth status 400`, () => expect(response.statusCode).toBe(ResponseStatus.BAD_REQUEST));
});

describe(`API returns auth user`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send({
        email: `test@t.ru`,
        password: `pswd`
      });
  });


  test(`Return auth status 200`, () => expect(response.statusCode).toBe(ResponseStatus.SUCCESS));
});

describe(`API returns unauthorized`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send({
        email: `test@t.ru`,
        password: `pswdBlabla`
      });
  });


  test(`Return auth status 401`, () => expect(response.statusCode).toBe(ResponseStatus.UNAUTHORIZED));
});

