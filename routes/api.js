'use strict';

const Book = require('../db').Book;

const getBooks = async (_req, res) => {
  try {
    const result = (await Book.find({})).map((i) => {
      return {
        _id: i._id,
        title: i.title,
        commentCount: i.comments.length,
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'failed to get books', error: err });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    !book ? res.json('no book exists') : res.json(book);
  } catch (err) {
    res.json({ bookId: id, message: 'failed to get book', error: err });
  }
};

const postBook = async (req, res) => {
  const { title } = req.body;
  if (!(title && title.trim().length > 0)) {
    return res.json('missing required field title');
  }

  try {
    const book = await new Book({ title }).save();
    return res.json({ _id: book._id, title: book.title });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'failed to create book', error: err });
  }
};

const postCommentInBook = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.json('missing required field comment');
  }

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      {
        new: true,
        upsert: true,
        returnDocument: 'after',
        useFindAndModify: false,
        select: '_id title comments',
      }
    );

    !book ? res.json('no book exists') : res.json(book);
  } catch (err) {
    res.json({ bookId: id, message: 'failed to post comment', error: err });
  }
};

const deleteBooks = async (_req, res) => {
  try {
    await Book.deleteMany({});
    res.json('complete delete successful');
  } catch (err) {
    res.status(500).json({ message: 'failed to delete books', error: err });
  }
};

const deleteBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndRemove(id);
    !book ? res.json('no book exists') : res.json('delete successful');
  } catch (err) {
    res.json({ bookId: id, message: 'failed to delete book', error: err });
  }
};

module.exports = function (app) {
  app.route('/api/books').get(getBooks).post(postBook).delete(deleteBooks);
  app
    .route('/api/books/:id')
    .get(getBookById)
    .post(postCommentInBook)
    .delete(deleteBookById);
};
