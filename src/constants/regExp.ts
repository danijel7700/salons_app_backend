export const RegExpConst = {
  PASSWORD:
    /^(?=.*[a-zšđćčž])(?=.*[A-ZŠĐŽČĆ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  FIRST_NAME: /^[A-ZŠĐŽČĆ][a-zšđćčž]*$/,
  LAST_NAME: /^[A-ZŠĐŽČĆ][a-zšđćčž]*$/,
  GENDER: /^[mMzZ]$/,
  SALON_NAME: /^[A-ZŠĐŽČĆ0-9][a-z0-9A-Zšđćčž ]*$/,
  STREET: /^[A-ZŠĐŽČĆ][a-zA-Zšđćčž ]*$/,
  STREET_NUMBER: /^[0-9]*$/,
  CITY: /^[A-ZŠĐŽČĆ][a-zA-ZŠĐŽČĆšđćčž ]*$/,
  TYPE: /^[mMzZoO]$/,
  WORK_TIME:
    /^(0[0-9]|1[0-9]|2[0-4]):(30|00)\s*-\s*(0[0-9]|1[0-9]|2[0-4]):(30|00)|Ne radi$/,
  APP_TIME: /^(0[0-9]|1[0-9]|2[0-4]):(?:00|30)$/,
  APP_DATE: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  REFFERENCE_NUMBER: /^\+\d{1,3}$/,
  NUMBER: /^\d+$/,
};
