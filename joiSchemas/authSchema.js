const Joi = require('joi');
const { getAllRoles } = require('../roles')

const roles = getAllRoles();

const authSchema = Joi.object({
    username: Joi.string().regex(/^[a-z_\d\s]+$/i).required()
        .messages({
            'string.pattern.base': "Username can only contain spaces, alphabets, numbers and underscore"
        }),

    password: Joi.string().min(4).required(),

    role: Joi.string().valid(...roles)

})


module.exports = authSchema;