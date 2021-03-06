'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Comment extends Model {
}

const define = (sequelize) => Comment.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  publicationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

module.exports = define;
