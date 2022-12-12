const Book = require('../models/Book.model');
const jwt = require("jsonwebtoken");
const roles = require('../roles')

// Public route
const getAllBooks = async(req, res) => {
    try {
        const books = await Book.find({}).populate('author');
        res.status(200).json({ books });

    } catch (error) {
        res.status(500).json("Some Error Occurred");
    }

};

// Protected route
const addBook = async(req, res) => {

    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(400).json({ error: "Please Provide Token" });
        }

        // Seperate the Bearer from the token
        const token = authorization.split(" ")[1];
        const { role } = await jwt.decode(token);

        if (roles.isAdmin(role)) {
            const book = await Book.create(req.body);
            res.status(201).json({ book });

        } else {
            return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        }

    } catch (error) {

        res.status(500).json("Some Error Occurred");
    }
};

// Public route
const getSingleBook = async(req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).populate('author');
        res.status(200).json({ book });
    } catch (error) {
        res.status(500).json("Some Error Occurred");
    }
};

// Protected route
const removeBook = async(req, res) => {

    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(400).json({ error: "Please Provide Token" });
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
            return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        }

    } catch (error) {
        return res.status(500).json({ error: "Please Check The Token Provided" })
    }

};

// Protected route
const updateBook = async(req, res) => {

    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(400).json({ error: "Please Provide Token" });
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
            return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        }

    } catch (error) {
        return res.status(500).json({ error: "Please Check The Token Provided" })
    }

};


// Public route
const searchBooks = async(req, res) => {

    try {
        const { query } = req.params;
        const search = new RegExp(query, 'gi');
        const book = await Book.find({ name: search });

        if (book.length == 0) {
            res.status(404).json({ error: "Query not found" })
            return
        }

        return res.status(200).json({ book });

    } catch (error) {

        return res.status(500).json("Some Error Occurred")
    }


}

module.exports = {
    getAllBooks,
    getSingleBook,
    removeBook,
    updateBook,
    addBook,
    searchBooks
}