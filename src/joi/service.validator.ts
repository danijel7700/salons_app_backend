import * as Joi from 'joi';
import { RegExpConst } from 'src/constants/regExp';

export const createServiceJoi = Joi.object({
  name: Joi.string().required(),
  cost: Joi.number().required(),
  terms: Joi.number().required(),
});

export const changeServiceJoi = Joi.object({
  id: Joi.string().required(),
  cost: Joi.number().required(),
  terms: Joi.number().required(),
});
