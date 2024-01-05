import * as Joi from 'joi';
import { RegExpConst } from 'src/constants/regExp';

export const createAdminJoi = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().pattern(new RegExp(RegExpConst.PASSWORD)).required(),
});
