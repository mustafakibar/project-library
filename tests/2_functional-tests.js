/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../db').Book;

const PATH = process.env.TEST_PATH || '/api/books';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  var tempBook;

  suite('Routing tests', () => {
    suite(
      `POST ${PATH} with title => create book object/expect book object`,
      () => {
        test(`Test POST ${PATH} with title`, (done) => {
          const book = new Book({ title: 'Awesome Title' })._doc;
          chai
            .request(server)
            .post(PATH)
            .send({ ...book })
            .end((err, res) => {
              if (err) return console.error(err);

              assert.equal(res.status, 200);
              assert.equal(res.body.title, book.title);
              tempBook = res.body;
              done();
            });
        });

        test(`Test POST ${PATH} with no title given`, (done) => {
          chai
            .request(server)
            .post(PATH)
            .send({})
            .end((err, res) => {
              if (err) return console.error(err);

              assert.equal(res.status, 200);
              assert.isString(res.body, 'response should be a string');
              assert.equal(res.body, 'missing required field title');
              done();
            });
        });
      }
    );

    suite(`GET ${PATH} => array of books`, () => {
      test(`Test GET ${PATH}`, (done) => {
        chai
          .request(server)
          .get(PATH)
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isArray(res.body, 'should be an array');
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount'
            );
            assert.property(
              res.body[0],
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body[0],
              '_id',
              'Books in array should contain _id'
            );
            done();
          });
      });
    });

    suite(`GET ${PATH}/[id] => book object with [id]`, () => {
      test(`Test GET ${PATH}/[id] with id not in db`, (done) => {
        chai
          .request(server)
          .get(`${PATH}/mustafa@kibar.pro`)
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isString(res.body, 'no book exists');
            done();
          });
      });

      test(`Test GET ${PATH}/[id] with valid id in db`, (done) => {
        chai
          .request(server)
          .get(`${PATH}/${tempBook._id}`)
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isObject(res.body, 'return should be an object');
            assert.property(res.body, 'comments', 'Books in array');
            assert.property(
              res.body,
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body,
              '_id',
              'Books in array should contain _id'
            );
            done();
          });
      });
    });

    suite(`POST ${PATH}/[id] => add comment/expect book object with id`, () => {
      const comment = 'My awesome comment!';
      test(`Test POST ${PATH}/[id] with comment`, (done) => {
        chai
          .request(server)
          .post(`${PATH}/${tempBook._id}`)
          .send({ comment })
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.isArray(res.body.comments, 'should be an array');
            assert.equal(res.body.comments[0], comment);
            done();
          });
      });

      test(`Test POST ${PATH}/[id] without comment field`, (done) => {
        chai
          .request(server)
          .post(`${PATH}/${tempBook._id}`)
          .send({})
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'missing required field comment');
            done();
          });
      });

      test(`Test POST ${PATH}/[id] with comment, id not in db`, (done) => {
        chai
          .request(server)
          .post(`${PATH}/mustafa@kibar.pro`)
          .send({ comment })
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
    });

    suite(`DELETE ${PATH}/[id] => delete book object id`, () => {
      test(`Test DELETE ${PATH}/[id] with valid id in db`, (done) => {
        chai
          .request(server)
          .delete(`${PATH}/${tempBook._id}`)
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'delete successful');
            done();
          });
      });

      test(`Test DELETE ${PATH}/[id] with  id not in db`, (done) => {
        chai
          .request(server)
          .delete(`${PATH}/mustafa@kibar.pro`)
          .end((err, res) => {
            if (err) return console.error(err);

            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
    });
  });
});
