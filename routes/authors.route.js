const express = require('express');
const router = express.Router();

const { getAllAuthors, getSingleAuthor, deleteAuthor, updateAuthor, addAuthor } = require('../controllers/authors.controller')

router.route('/').get(getAllAuthors).post(addAuthor);
router.route('/:id').get(getSingleAuthor).patch(updateAuthor).delete(deleteAuthor);


module.exports = router;