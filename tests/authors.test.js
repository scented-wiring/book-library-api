/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
  before(async () => Author.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app).post('/authors').send({
          author: 'Harper Lee',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.author).to.equal('Harper Lee');
        expect(newAuthorRecord.author).to.equal('Harper Lee');
      });

      it('returns an error if author is null', async () => {
        const response = await request(app).post('/authors').send({});

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Author is required.');
      });

      it('returns an error if author is empty', async () => {
        const response = await request(app).post('/authors').send({
          author: '',
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Author is required.');
      });
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
      await Author.destroy({ where: {} });

      authors = await Promise.all([
        Author.create({
          author: 'Harper Lee',
        }),
        Author.create({
          author: 'George Orwell',
        }),
        Author.create({
          author: 'Margaret Atwood',
        }),
      ]);
    });

    describe('GET /authors', () => {
      it('gets all author records', async () => {
        const response = await request(app).get('/authors');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.name).to.equal(expected.name);
        });
      });
    });

    describe('GET /authors/:id', () => {
      it('gets author record by id', async () => {
        const author = authors[0];
        const response = await request(app).get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it("returns a 404 if the author doesn't exist", async () => {
        const response = await request(app).get('/authors/912');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('PATCH /authors/:id', () => {
      it('updates author field by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: 'George Orwell' });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal('George Orwell');
      });

      it("returns a 404 if the author doesn't exist", async () => {
        const response = await request(app)
          .patch('/authors/1000')
          .send({ name: 'Sudo Nym' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('DELETE /authors/:id', () => {
      it('deletes author field by id', async () => {
        const author = authors[0];
        const response = await request(app).delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it("returns a 404 if the author doesn't exist", async () => {
        const response = await request(app).delete('/authors/1000000');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });
  });
});
