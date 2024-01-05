import * as Joi from 'joi';
import { RegExpConst } from 'src/constants/regExp';

export const changePasswordJoi = Joi.string()
  .pattern(new RegExp(RegExpConst.PASSWORD))
  .required();

export const sendResetPassEmailJoi = Joi.string().email().required();

export const resetPassowordJoi = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp(RegExpConst.PASSWORD))
    .required(),
});
