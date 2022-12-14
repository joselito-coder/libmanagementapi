const Author = require('../models/Author.model');
const jwt = require("jsonwebtoken");
const roles = require('../roles');
const authorSchema = require('../joiSchemas/authorSchema');
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/customError')

// Public route
const getAllAuthors = asyncWrapper(async (req, res) => {

    const authors = await Author.find({});
    res.status(200).json({ authors });


})

// Protected route ( can Only be used by librarian)
const addAuthor = asyncWrapper(async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {

        return next(createCustomError(`Please provide token`, 400))
    }

    // Seperate the Bearer from the token
    const token = authorization.split(" ")[1];
    const { role } = await jwt.decode(token);

    if (roles.isAdmin(role)) {

        let { value, error } = authorSchema.validate(req.body)

        if (error) {
            let errorMsg = error.details[0].message;
            return next(createCustomError(errorMsg, 400));
        }

        const author = await Author.create(req.body);
        return res.status(201).json({ author });

    } else {
        // return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        return next(createCustomError(`Not Authorized to add Author, Kindly ask a librarian or an admin`, 403));

    }
})


// Public route
const getSingleAuthor = asyncWrapper(async (req, res, next) => {

    const { id } = req.params;
    const author = await Author.findById(id);
    if (!author) {
        return res.status(404).json({ error: `No Author with id ${id} found`, success: false });

    }
    res.status(200).json({ author });

})

// Protected route
const updateAuthor = asyncWrapper(async (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization) {
        return next(createCustomError(`Please provide token`, 400))
    }
    // Seperate the Bearer from the token
    const token = authorization.split(" ")[1];
    const { role } = await jwt.decode(token);

    if (roles.isAdmin(role)) {

        const { id } = req.params;
        const author = await Author.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (!author) {
            res.status(404).json({ error: `No Author with id ${id} found`, success: false });
            return;
        }
        return res.status(200).json({ success: true, author });


    } else {
        return next(createCustomError("Not Authorized to add author, Kindly ask a librarian or an admin", 401));
    }

})

const deleteAuthor = asyncWrapper(async (req, res) => {

    const { authorization } = req.headers;
    if (!authorization) {
        return next(createCustomError(`Please provide token`, 400))
    }
    // Seperate the Bearer from the token
    const token = authorization.split(" ")[1];
    const { role } = await jwt.decode(token);

    if (roles.isAdmin(role)) {

        const { id } = req.params;
        const author = await Author.findOneAndDelete({ _id: id });
        if (!author) {
            res.status(404).json({ error: `No Author with id ${id} found`, success: false });
            return;
        }
        return res.status(200).json({ success: true, author });



    } else {
        return next(createCustomError("Not Authorized to add author, Kindly ask a librarian or an admin", 401));
    }


})


module.exports = {
    addAuthor,
    getSingleAuthor,
    getAllAuthors,
    updateAuthor,
    deleteAuthor
}