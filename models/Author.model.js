const mongoose = require('mongoose');


const AuthorSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Must provide name" ],
        trim: true

    },
    booksPublished: {
        type:Number,
        required: [true , "Must provide number of books published"]
    },

    awardsReceived: {
        type:Number,
        required: [true , "Must provide number of awards published"]
    },



})


module.exports = mongoose.model('Author',AuthorSchema);