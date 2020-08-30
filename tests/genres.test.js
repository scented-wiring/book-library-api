/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => Genre.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Horror',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Horror');
        expect(newGenreRecord.genre).to.equal('Horror');
      });

      it('returns an error if genre is null', async () => {
        const response = await request(app).post('/genres').send({});

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Genre is required.');
      });

      it('returns an error if genre is empty', async () => {
        const response = await request(app).post('/genres').send({
          genre: '',
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Genre is required.');
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          genre: 'Horror',
        }),
        Genre.create({
          genre: 'Thriller',
        }),
        Genre.create({
          genre: 'Non-fiction',
        }),
      ]);
    });

    describe('GET /genres', () => {
      it('get all genre records', async () => {
        const response = await request(app).get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it("returns a 404 if the genre doesn't exist", async () => {
        const response = await request(app).get('/genres/1000');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genre field by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Sci-fi' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('Sci-fi');
      });

      it("returns a 404 if the genre doesn't exist", async () => {
        const response = await request(app)
          .patch('/genres/1000')
          .send({ genre: 'Non-fiction' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedReader = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the genre doesn't exist", async () => {
        const response = await request(app).delete('/genres/1000000');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
