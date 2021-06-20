const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
    fname: Joi.string()
        .min(4)
        .required(),
    email: Joi.string()
        .min(6)
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
});

module.exports = registerSchema;