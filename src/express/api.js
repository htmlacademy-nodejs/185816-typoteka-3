'use strict';

const {Method} = require(`../constants`);
const axios = require(`axios`);
const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  getArticles() {
    return this._load(`/publications`, {
      params: {
        comments: true,
        categories: true
      }
    });
  }

  getArticleById(id) {
    return this._load(`/publications/${id}`);
  }

  getCategories() {
    return this._load(`/categories`);
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
