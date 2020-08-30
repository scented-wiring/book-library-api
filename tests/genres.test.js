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
          name: 'Horror',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Horror');
        expect(newGenreRecord.name).to.equal('Horror');
      });

      it('returns an error if genre name is null', async () => {
        const response = await request(app).post('/genres').send({});

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Genre name is required.');
      });

      it('returns an error if genre name is empty', async () => {
        const response = await request(app).post('/genres').send({
          genre: '',
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(response.body.errors[0]).to.equal('Genre name is required.');
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          name: 'Horror',
        }),
        Genre.create({
          name: 'Thriller',
        }),
        Genre.create({
          name: 'Non-fiction',
        }),
      ]);
    });

    describe('GET /genres', () => {
      it('Get all genre records', async () => {
        const response = await request(app).get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.name).to.equal(expected.name);
        });
      });
    });

    describe('GET /genres/:id', () => {
      it('Gets genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(genre.name);
      });

      it("Returns a 404 if the genre doesn't exist", async () => {
        const response = await request(app).get('/genres/1000');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('Updates genre field by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ name: 'Sci-fi' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.name).to.equal('Sci-fi');
      });

      it("Returns a 404 if the genre doesn't exist", async () => {
        const response = await request(app)
          .patch('/genres/1000')
          .send({ name: 'Non-fiction' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('Deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedReader = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("Returns a 404 if the genre doesn't exist", async () => {
        const response = await request(app).delete('/genres/1000000');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
