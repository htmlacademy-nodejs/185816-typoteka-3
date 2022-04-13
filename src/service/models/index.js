'use strict';

const {Model} = require(`sequelize`);
const Alias = require(`./alias`);
const defineRole = require(`./role`);
const defineUser = require(`./user`);
const defineCategory = require(`./category`);
const definePublication = require(`./publication`);
const defineComment = require(`./comment`);

const define = (sequelize) => {
  /**
   * Init models
   */
  const Category = defineCategory(sequelize);
  const Role = defineRole(sequelize);
  const User = defineUser(sequelize);
  const Publication = definePublication(sequelize);
  const Comment = defineComment(sequelize);

  class PublicationCategories extends Model {
  }

  PublicationCategories.init({}, {
    sequelize,
    modelName: `PublicationCategories`,
    tableName: `publication_categories`,
    timestamps: false
  });

  /**
   * Init relationships
   */

  Role.hasMany(User, {
    as: Alias.USERS,
    foreignKey: `roleId`,
    onDelete: `cascade`
  });

  User.belongsTo(Role, {
    foreignKey: `roleId`,
  });

  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(User, {
    foreignKey: `userId`,
  });

  Publication.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `publicationId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(Publication, {
    foreignKey: `publicationId`,
  });

  Category.belongsToMany(Publication, {
    through: PublicationCategories,
    as: Alias.PUBLICATIONS
  });

  Publication.belongsToMany(Category, {
    through: PublicationCategories,
    as: Alias.CATEGORIES
  });

  return {Category, Role, User, Publication, Comment};
};

module.exports = define;
