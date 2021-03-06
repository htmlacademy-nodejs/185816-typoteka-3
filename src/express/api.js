'use strict';

const {Method} = require(`../constants`);
const axios = require(`axios`);

const {API_HOST, API_TIMEOUT_REQUEST} = process.env;

const somethingIsNotDefined = [API_HOST, API_TIMEOUT_REQUEST].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined API`);
}

const TIMEOUT = 1000 || API_TIMEOUT_REQUEST;

const defaultUrl = `${API_HOST}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async getArticles({limit, offset}, includes = false) {
    let options = {};

    if (limit || offset) {
      options = {
        limit,
        offset
      };
    }

    if (includes) {
      options.categories = true;
      options.comments = true;
    }

    return this._load(`/publications`, {
      params: options
    });
  }

  getArticleById(id) {
    return this._load(`/publications/${id}`);
  }

  getArticleByUserId(id) {
    return this._load(`/publications/user/${id}`);
  }

  getCategories() {
    return this._load(`/categories`);
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: Method.POST,
      data
    });
  }

  updateCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: Method.PUT,
      data
    });
  }

  dropCategory(id) {
    return this._load(`/categories/${id}`, {
      method: Method.DELETE
    });
  }

  getComments() {
    return this._load(`/comments`);
  }

  getCommentByUserId(id) {
    return this._load(`/comments/user/${id}`);
  }

  createComment(data) {
    return this._load(`/comments`, {
      method: Method.POST,
      data
    });
  }

  createArticle(data) {
    return this._load(`/publications`, {
      method: Method.POST,
      data
    });
  }

  updateArticle(id, data) {
    return this._load(`/publications/${id}`, {
      method: Method.PUT,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: Method.POST,
      data
    });
  }

  auth(data) {
    return this._load(`/user/auth`, {
      method: Method.POST,
      data
    });
  }

  search(query) {
    return this._load(`/search?query=${query}`);
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
