const db = require("../models");
const Book = db.books;
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  try {
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
      author: req.body.author,
      publicationDate: pubDate,
      resume: req.body.abstract,
      cover: req.body.cover,
      userId: req.body.userId
    };

    // Save Book in the database
    const newBook = await Book.create(book);
    res.send(newBook);
  } catch(error) {
    res.status(500).send({
      message:
      error.message || "Some errors ocurred while creating the book"
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const userId = req.params.id;

    const book = await Book.findAll({ where: { userId: userId } });
    res.send(book);
  } catch(error) {
    res.status(500).send({
      message:
      error.message || "Some error occurred while searching your books."
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findByPk(id);
    res.send(book);
  } catch(error) {
    res.status(500).send({
      message: "An error ocurred when searching for book with id: " + id
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Book.update(req.body, { where: { id: id } });

    if (num == 1) {
      res.send({
        message: "This book has been succesfully updated."
      });
    } else {
      res.send({
        message: `Cannot update Book with id=${id}`
      });
    }
  } catch(error) {
    res.status(500).send({
      message: "Error updating the book with id=" + id
    });
  }
};

exports.delete = async (req, res) => {
  try {
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
  } catch(error) {
    res.status(500).send({
      message: "Could not delete book with id=" + id
    });
  }
};

