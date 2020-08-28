/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'Moby Dick',
          author: 'Herman Melville',
          genre: 'Nautical Fiction',
          ISBN: '9780349112336',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Moby Dick');
        expect(newBookRecord.title).to.equal('Moby Dick');
        expect(newBookRecord.author).to.equal('Herman Melville');
        expect(newBookRecord.genre).to.equal('Nautical Fiction');
        expect(newBookRecord.ISBN).to.equal('9780349112336');
      });

      it('returns an error if title is null', async () => {
        const response = await request(app).post('/books').send({
          author: 'Herman Melville',
          genre: 'Nautical Fiction',
          ISBN: '9780349112336',
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Title is required.');
      });

      it('returns an error if author is null', async () => {
        const response = await request(app).post('/books').send({
          title: 'Moby Dick',
          genre: 'Nautical Fiction',
          ISBN: '9780349112336',
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Author is required.');
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'Moby Dick',
          author: 'Herman Melville',
          genre: 'Nautical Fiction',
          ISBN: '9780349112336',
        }),
        Book.create({
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          genre: 'Southern Gothic',
          ISBN: '9780099419785',
        }),
        Book.create({
          title: 'Things Fall Apart',
          author: 'Chinua Achebe',
          genre: 'Historical Fiction',
          ISBN: '9780435272463',
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all book records', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets book by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('Moby Dick');
        expect(response.body.author).to.equal('Herman Melville');
        expect(response.body.genre).to.equal('Nautical Fiction');
        expect(response.body.ISBN).to.equal('9780349112336');
      });

      it("returns an error if the book doesn't exist", async () => {
        const response = await request(app).get('/books/9999');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates fields by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: 'Doby Mick' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal('Doby Mick');
      });

      it("returns an error if the book doesn't exist", async () => {
        const response = await request(app)
          .patch('/books/1000')
          .send({ title: 'Booky McBookFace' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes books by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns an error if the book doesn't exist", async () => {
        const response = await request(app).delete('/books/1000');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
