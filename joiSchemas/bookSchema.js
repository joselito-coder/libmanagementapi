const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


const bookSchema = Joi.object({
    name: Joi.string().regex(/^[a-z\d\s]+$/i).required()
        .messages({
            'string.pattern.base': "Please provide alphanumeric name ( can contain spaces )"
        }),
    pages: Joi.number().integer().required(),

    published: Joi.date().required(),

    publisher: Joi.string().regex(/^[a-z\d\s]+$/i).required()
        .messages({
            'string.pattern.base': "Please provide alphanumeric publisher ( can contain spaces )"
        }),

    author: Joi.objectId()
        .messages({
            'string.pattern.name': "Please Provide valid Author Id"
        })
})

module.exports = bookSchema;