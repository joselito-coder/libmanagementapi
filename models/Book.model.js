const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Must provide book name"]
    },
    pages: {
        type: Number,
        required: [true, "Must provide Number of pages"]
    },
    published: {
        type: Date,
        required: [true, "Must provide published date"]
    },

    publisher: {
        type: String,
        required: [true, "Must provide A publisher"]
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: [true, "Must provide A author id"]
    }

})

module.exports = mongoose.model('Book', BookSchema);