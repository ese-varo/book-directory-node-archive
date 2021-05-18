const db = require("../models");
const Book = db.book;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.author) {
    res.status(400).send({
      message: "Title and Author are required!"
    });
    return;
  }

  let pubDate = new Date().toString();
  if (req.body.publicationDate) {
    pubDate = req.body.publicationDate.toString();
  }

  // Create a book
  const book = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    publicationDate: pubDate,
    resume: req.body.abstract,
    cover: req.body.cover
  };

  // Save Book in the database
  Book.create(book)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some errors ocurred while creating the book"
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Book.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while searching your books."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Book.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "An error ocurred when searching for book with id: " + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Book.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "This book has been succesfully updated."
        });
      } else {
        res.send({
          message: `Cannot update Book with id=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating the book with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Book.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "The book was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete book with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete book with id=" + id
      });
    });
};

