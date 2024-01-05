import * as Joi from 'joi';
import { RegExpConst } from 'src/constants/regExp';

export const createAppointmentJoi = Joi.object({
  time: Joi.string().pattern(new RegExp(RegExpConst.APP_TIME)).required(),
  date: Joi.string().pattern(new RegExp(RegExpConst.APP_DATE)).required(),
  hairStylistId: Joi.string().required(),
  serviceId: Joi.string().required(),
});
