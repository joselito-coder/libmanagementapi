const express = require('express');
const router = express.Router();



const { searchBooks,  getAllBooks, getSingleBook, updateBook, addBook, removeBook } = require('../controllers/books.controller');

router.route('/').get(getAllBooks).post(addBook);

router.route('/:id').patch(updateBook).delete(removeBook).get(getSingleBook);

router.route('/search/:query').get(searchBooks);

module.exports = router;

