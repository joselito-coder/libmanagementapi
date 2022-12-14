const Book = require('../models/Book.model');
const jwt = require("jsonwebtoken");
const roles = require('../roles');
const asyncWrapper = require('../middleware/async');
const bookSchema = require('../joiSchemas/bookSchema');
const { createCustomError } = require('../errors/customError');

// Public route
const getAllBooks = asyncWrapper(async (req, res, next) => {
    const books = await Book.find({}).populate('author');
    res.status(200).json({ books });

});

// Protected route
const addBook = asyncWrapper(async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return next(createCustomError(`Please provide token`, 400))
    }

    // Seperate the Bearer from the token
    const token = authorization.split(" ")[1];
    const { role } = await jwt.decode(token);

    if (roles.isAdmin(role)) {

        const { value, error } = bookSchema.validate(req.body);

        if (error) {
            let errorMsg = error.details[0].message;
            return next(createCustomError(errorMsg, 400));
        }


        const book = await Book.create(req.body);
        res.status(201).json({ book });

    } else {
        return next(createCustomError("Not Authorized to add author, Kindly ask a librarian or an admin", 401));
    }

});

// Public route
const getSingleBook = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id).populate('author');
    res.status(200).json({ book });
});

// Protected route
const removeBook = asyncWrapper(async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return next(createCustomError(`Please provide token`, 400))
    }

    // Seperate the Bearer from the token
    const token = authorization.split(" ")[1];
    const { role } = await jwt.decode(token);

    if (roles.isAdmin(role)) {

        const { id } = req.params;
        const book = await Book.findOneAndDelete({ _id: id });

        if (!book) {
            res.status(404).json({ error: `No Book with id ${id}`, success: false })
            return;
        }
        return res.status(200).json({ success: true, book });


    } else {
        return next(createCustomError("Not Authorized to add author, Kindly ask a librarian or an admin", 401));
    }

});

// Protected route
const updateBook = asyncWrapper(async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return next(createCustomError(`Please provide token`, 400))
    }

    // Seperate the Bearer from the token
    const token = authorization.split(" ")[1];
    const { role } = await jwt.decode(token);

    if (roles.isAdmin(role)) {

        const { id } = req.params;
        const book = await Book.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (!book) {
            res.status(404).json({ error: `No Book with id ${id}`, success: false })
            return;
        }
        return res.status(200).json({ success: true, book });



    } else {
        return next(createCustomError("Not Authorized to add author, Kindly ask a librarian or an admin", 401));
    }

});


// Public route
const searchBooks = asyncWrapper(async (req, res, next) => {

    const { query } = req.params;
    const search = new RegExp(query, 'gi');
    const book = await Book.find({ name: search });

    if (book.length == 0) {
        res.status(404).json({ error: "Query not found" })
        return
    }

    return res.status(200).json({ book });


})

module.exports = {
    getAllBooks,
    getSingleBook,
    removeBook,
    updateBook,
    addBook,
    searchBooks
}