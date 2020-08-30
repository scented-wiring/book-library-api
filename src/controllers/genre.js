const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('./helpers');

const getGenres = (_, res) => getAllItems(res, 'genre');

const createGenre = (req, res) => createItem(res, 'genre', req.body);

const updateGenre = (req, res) =>
  updateItem(res, 'genre', req.body, req.params.id);

const getGenreById = (req, res) => getItemById(res, 'genre', req.params.id);

const deleteGenre = (req, res) => deleteItem(res, 'genre', req.params.id);

module.exports = {
  getGenres,
  createGenre,
  updateGenre,
  getGenreById,
  deleteGenre,
};
