'use strict';

const {
  ResponseStatus
} = require(`../../constants`);
const {Router} = require(`express`);

const validateMiddleware = require(`../middlewares/validated-entitties`);
const publicationsSchema = require(`../validators/publication`);
const commentSchema = require(`../validators/comment`);


module.exports = (app, PublicationDataService, CommentService) => {
  const router = new Router();
  app.use(`/publications`, router);

  /**
   * Get all items
   * @method GET
   * @return {array|string}
   */
  router.get(`/`, async (req, res) => {
    const {categories, comments, offset, limit, category} = req.query;

    let items;

    try {
      if (limit || offset) {
        items = await PublicationDataService.findPage({limit, offset, category});
      } else {
        items = await PublicationDataService.getAll({categories, comments});
      }

      res.send(items);
    } catch (e) {
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send(e.message);
    }
  });

  /**
   * Get by ID
   *
   * @method GET
   * @return {object|string}
   */
  router.get(`/:id`, async (req, res) => {
    try {
      const item = await PublicationDataService.getById(req.params.id);
      if (item) {
        res.send(item);
      } else {
        res
          .status(ResponseStatus.NOT_FOUND)
          .send({success: true, message: `not found`});
      }
    } catch (e) {
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send(e.message);
    }
  });

  /**
   * Get publications by User ID
   *
   * @method GET
   * @return {object|string}
   */
  router.get(`/user/:id`, async (req, res) => {
    try {
      const item = await PublicationDataService.getByAuthorId(req.params.id);
      if (item) {
        res.send(item);
      } else {
        res
          .status(ResponseStatus.NOT_FOUND)
          .send({success: true, message: `not found`});
      }
    } catch (e) {
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send(e.message);
    }
  });

  /**
   * Create new publication
   *
   * @method POST
   * @schema {
   *   userId: Integer,
   *   title: String,
   *   announce: String,
   *   description: String,
   *   preview: String,
   *   categories: Array
   * }
   * @return {object|string}
   */
  router.post(`/`, validateMiddleware(publicationsSchema), async (req, res) => {
    try {
      const item = await PublicationDataService.create(req.body);
      const io = req.app.locals.socketio;
      const publication = await PublicationDataService.getById(item.id);
      io.emit(`publication:create`, publication);

      res
        .status(ResponseStatus.SUCCESS_CREATE)
        .send(item);
    } catch (e) {
      console.log(e);
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send({success: false, error: e.message});
    }
  });

  /**
   * Update publication
   *
   * @method PUT
   * @schema {
   *   userId: Integer,
   *   title: String,
   *   announce: String,
   *   description: String,
   *   preview: String,
   *   categories: Array
   * }
   * @return {object}
   */
  router.put(`/:id`, validateMiddleware(publicationsSchema), async (req, res) => {
    try {
      const publication = await PublicationDataService.update(req.params.id, req.body);

      res.send(publication);
    } catch (e) {
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send(e.message);
    }
  });

  /**
   * Delete publication by ID
   *
   * @method DELETE
   * @return {string}
   */
  router.delete(`/:id`, async (req, res) => {
    try {
      await PublicationDataService.drop(req.params.id);

      res.send(`Delete success`);
    } catch (e) {
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send(e.message);
    }
  });

  /**
   * Create comment by Publication ID
   *
   * @method POST
   * @schema {
   *   userId: Integer,
   *   publicationId: Integer,
   *   message: String
   * }
   */
  router.post(`/:id/comment`, validateMiddleware(commentSchema), async (req, res) => {
    const data = req.body;
    data.publicationId = req.params.id;

    try {
      const item = await CommentService.create(data);

      res
        .status(ResponseStatus.SUCCESS_CREATE)
        .send(item);
    } catch (e) {
      res
        .status(ResponseStatus.INTERNAL_ERROR)
        .send({success: false, error: e.message});
    }
  });
};
