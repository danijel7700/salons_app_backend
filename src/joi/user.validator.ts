import * as Joi from 'joi';
import { RegExpConst } from 'src/constants/regExp';

const phoneNumberJoiSchema = Joi.object({
  refferenceNumber: Joi.string()
    .pattern(RegExpConst.REFFERENCE_NUMBER)
    .required(),
  number: Joi.string().pattern(RegExpConst.NUMBER).required(),
});

export const createUserJoi = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().pattern(new RegExp(RegExpConst.PASSWORD)).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string()
    .pattern(new RegExp(RegExpConst.FIRST_NAME))
    .required(),
  lastName: Joi.string().pattern(new RegExp(RegExpConst.LAST_NAME)).required(),
  gender: Joi.string().pattern(new RegExp(RegExpConst.GENDER)),
  phoneNumber: phoneNumberJoiSchema.required(),
});
