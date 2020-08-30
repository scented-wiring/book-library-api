const express = require('express');

const router = express.Router();
const AuthorController = require('../controllers/author');

router
  .route('/')
  .get(AuthorController.getAuthors)
  .post(AuthorController.createAuthor);

router
  .route('/:id')
  .get(AuthorController.getAuthorById)
  .patch(AuthorController.updateAuthor)
  .delete(AuthorController.deleteAuthor);

module.exports = router;
