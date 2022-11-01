const Author = require('../models/Author.model');
const jwt = require("jsonwebtoken");


// Public route
const getAllAuthors = async (req, res) => {

    try {
        const authors = await Author.find({});
        res.status(200).json({ authors });

    } catch (error) {
        res.status(500).json({ msg: error })
    }

}

// Protected route ( can Only be used by librarian)
const addAuthor = async (req, res) => {

    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(400).json({ error: "Please Provide Token" });
        }

        // Seperate the Bearer from the token
        const token = authorization.split(" ")[1];
        const { role } = await jwt.decode(token);

        if (role === "librarian") {
            const author = await Author.create(req.body);
            return res.status(201).json({ author });

        } else {
            return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        }

    } catch (error) {
        res.status(500).json({ error: "Please Check The Token Provided" })
    }

}


// Public route
const getSingleAuthor = async (req, res) => {

    try {

        const { id } = req.params;
        const author = await Author.findById(id);
        if (!author) {
            res.status(404).json({ error: `No Author with id ${id} found`, success: false });
            return;
        }
        res.status(200).json({ author });

    } catch (error) {

        res.status(500).json({ msg: error })
    }
}

// Protected route
const updateAuthor = async (req, res) => {
    try {

        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(400).json({ error: "Please Provide Token" });
        }
        // Seperate the Bearer from the token
        const token = authorization.split(" ")[1];
        const { role } = await jwt.decode(token);

        if (role === "librarian") {

            const { id } = req.params;
            const author = await Author.findOneAndUpdate({ _id: id }, req.body, { new: true });
            if (!author) {
                res.status(404).json({ error: `No Author with id ${id} found`, success: false });
                return;
            }
            return res.status(200).json({ success: true, author });


        } else {
            return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        }

    } catch (error) {
        res.status(500).json({ error: "Please Check The Token Provided" })
    }
}
const deleteAuthor = async (req, res) => {
    try {

        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(400).json({ error: "Please Provide Token" });
        }
        // Seperate the Bearer from the token
        const token = authorization.split(" ")[1];
        const { role } = await jwt.decode(token);

        if (role === "librarian") {

            const { id } = req.params;
            const author = await Author.findOneAndDelete({ _id: id });
            if (!author) {
                res.status(404).json({ error: `No Author with id ${id} found`, success: false });
                return;
            }
            return res.status(200).json({ success: true, author });



        } else {
            return res.status(401).json({ error: "Not Authorized to add author, Kindly ask a librarian" });
        }


    } catch (error) {

        res.status(500).json({ error: "Please Check The Token Provided" })

    }

}


module.exports = {
    addAuthor,
    getSingleAuthor,
    getAllAuthors,
    updateAuthor,
    deleteAuthor
}