export const validateMobileNumber = (_: any, value: any) => {
  if (value) {
    const isInvalidLength = value.length !== 11;
    const doesNotStartWith01 = !value.startsWith("01");

    if (isInvalidLength || doesNotStartWith01) {
      return Promise.reject("Invalid mobile number");
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.resolve();
  }
};
