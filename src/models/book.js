module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("books", {
    title: {
      type: Sequelize.STRING
    },
    author: {
      type: Sequelize.STRING
    },
    publicationDate: {
      type: Sequelize.STRING
    },
    resume: {
      type: Sequelize.TEXT
    },
    cover: {
      type: Sequelize.BLOB("long")
    }
  });

  return Book;
};
