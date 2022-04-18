'use strict';

const {ResponseStatus} = require(`../../constants`);

module.exports = (UserDataService) => {
  return async (req, res, next) => {
    const currentUser = await UserDataService.getById(req.body.userId);

    if (!currentUser) {
      res
        .status(ResponseStatus.UNAUTHORIZED)
        .send(`User unauthorized`);
    } else {
      next();
    }
  };
};
