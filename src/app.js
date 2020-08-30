const express = require('express');
const readerRouter = require('./routes/reader');
const bookRouter = require('./routes/book');
const genreRouter = require('./routes/genre');
const authorRouter = require('./routes/author');

const app = express();

app.use(express.json());

app.use('/readers', readerRouter);
app.use('/books', bookRouter);
app.use('/genres', genreRouter);
app.use('/authors', authorRouter);

module.exports = app;
