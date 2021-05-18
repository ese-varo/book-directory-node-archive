const { authJwt } = require("../middleware");
const books = require("../controllers/book");
const router = require("express").Router();

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new Books
  router.post("/", [authJwt.verifyToken], books.create);

  // Retrieve all user Books
  router.get("/user/:id", [authJwt.verifyToken], books.findAll);

  // Retrieve a single Book with id
  router.get("/:id", [authJwt.verifyToken], books.findOne);

  // Update a Book with id
  router.put("/:id", [authJwt.verifyToken], books.update);

  // Delete a Book with id
  router.delete("/:id", [authJwt.verifyToken], books.delete);

  app.use('/api/v1/books', router);
};
