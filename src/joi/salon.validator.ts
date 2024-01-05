import * as Joi from 'joi';
import { RegExpConst } from 'src/constants/regExp';

export const createSalonJoi = Joi.object({
  name: Joi.string().pattern(new RegExp(RegExpConst.SALON_NAME)).required(),
  location: {
    street: Joi.string().pattern(new RegExp(RegExpConst.STREET)).required(),
    number: Joi.string()
      .pattern(new RegExp(RegExpConst.STREET_NUMBER))
      .required(),
  },
  city: Joi.string().pattern(new RegExp(RegExpConst.CITY)).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(RegExpConst.PASSWORD)).required(),
  PIB: Joi.number().min(100000000).max(999999999).required(),
  type: Joi.string().pattern(new RegExp(RegExpConst.TYPE)).required(),
  workTime: Joi.array()
    .length(7)
    .items(Joi.string().pattern(new RegExp(RegExpConst.WORK_TIME)))
    .required(),
});

export const markSalonJoi = Joi.object({
  salonId: Joi.string().required(),
  mark: Joi.number().min(1).max(5).required(),
});

export const getTermsJoi = Joi.object({
  hairStylistId: Joi.string().required(),
  date: Joi.string().pattern(new RegExp(RegExpConst.APP_DATE)).required(),
  serviceId: Joi.string().required(),
});

export const changeWorkTime = Joi.object({
  workTime: Joi.array()
    .length(7)
    .items(Joi.string().pattern(new RegExp(RegExpConst.WORK_TIME)))
    .required(),
});
