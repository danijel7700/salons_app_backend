import * as Joi from 'joi';

export const createHairStylistJoi = Joi.object({
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
});
