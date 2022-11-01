const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Enter username']
    },

    password: {
        type: String,
        required: [true, 'Please Enter username']
    },

    role: {
        type: String,
        enum: ['student', 'librarian'],
        default: 'student'
    }

});

AuthSchema.pre('save', async function (next) {

    const user = this;

    if (this.isModified("password") || this.isNew) {

        try {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(user.password, salt);

            user.password = hash;
            next();

        } catch (error) {
            return next(error);
        }
    } else {
        return next();
    }


})



module.exports = mongoose.model('Auth', AuthSchema);