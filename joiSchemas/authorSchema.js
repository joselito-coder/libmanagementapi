const Joi = require('joi');

const authorSchema = Joi.object({
    name: Joi.string().regex(/^[a-z\d\s]+$/i).required()
        .messages({
            'string.pattern.base': "Please provide alphanumeric name ( can contain spaces )"
        }),

    booksPublished: Joi.number().integer().required(),

    awardsReceived: Joi.number().integer().required()

})


module.exports = authorSchema;