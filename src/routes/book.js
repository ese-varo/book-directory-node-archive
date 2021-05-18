module.exports = app => {
  const books = require("../controllers/book.js");

  var router = require("express").Router();

  // Create a new Books
  router.post("/", books.create);

  // Retrieve all user Books
  router.get("/", books.findAll);

  // Retrieve a single Book with id
  router.get("/:id", books.findOne);

  // Update a Book with id
  router.put("/:id", books.update);

  // Delete a Book with id
  router.delete("/:id", books.delete);

  app.use('/api/v1/books', router);
};
