const Joi = require('joi');

const createUserDto = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
});

const updateUserDto = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
});

module.exports = {
  createUserDto,
  updateUserDto
}; 