const { Book } = require('../models');

const getBooks = (_, res) => {
  Book.findAll().then((books) => {
    res.status(200).json(books);
  });
};

const createBook = (req, res) => {
  const newBook = req.body;

  Book.create(newBook).then((newBookCreated) =>
    res.status(201).json(newBookCreated)
  );
};

const getBookById = (req, res) => {
  const { id } = req.params;

  Book.findByPk(id).then((book) => {
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      res.status(200).json(book);
    }
  });
};

module.exports = {
  getBooks,
  createBook,
  getBookById,
};
