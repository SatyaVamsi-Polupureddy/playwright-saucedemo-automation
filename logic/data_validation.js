const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

export const validateUserCredentials = (username, password) => {
  if (!username || !password) {
    return false;
  }
  if (password.length < 8) {
    return false;
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9@_]*$/.test(username)) {
    return false;
  }
  return true;
};

export const validateCheckoutInformation = (
  firstName,
  lastName,
  postalCode,
) => {
  if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
    return false;
  }

  if (
    !/^[A-Za-z0-9_@]+$/.test(firstName) ||
    !/^[A-Za-z0-9_@]+$/.test(lastName)
  ) {
    return false;
  }

  if (!/^[0-9]{6}$/.test(postalCode)) {
    return false;
  }

  return true;
};
