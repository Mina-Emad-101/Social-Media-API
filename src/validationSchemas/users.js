import { body } from "express-validator";
import { passwordConfirmation } from "../utils/customValidators.js";

export const createSchema = {
  username: {
    notEmpty: { errorMessage: "Username can't be empty" },
    isAlphanumeric: { errorMessage: "Username has to be Alphanumeric" },
  },
  email: {
    notEmpty: { errorMessage: "Email can't be empty" },
    isEmail: { errorMessage: "Email invalid, Email: john@doe.end" },
  },
  password: {
    notEmpty: { errorMessage: "Password can't be empty" },
    isStrongPassword: { errorMessage: "Password has to be strong" },
  },
  password_confirm: {
    notEmpty: { errorMessage: "Password Confirmation can't be empty" },
    custom: {
      options: passwordConfirmation,
      errorMessage: "Password and Password Confirmation not equal",
    },
  },
};

export const putSchema = {
  username: {
    notEmpty: { errorMessage: "Username can't be empty" },
    isAlphanumeric: { errorMessage: "Username has to be Alphanumeric" },
  },
  email: {
    notEmpty: { errorMessage: "Email can't be empty" },
    isEmail: { errorMessage: "Email invalid, Email: john@doe.end" },
  },
  password: {
    notEmpty: { errorMessage: "Password can't be empty" },
    isStrongPassword: { errorMessage: "Password has to be strong" },
  },
  password_confirm: {
    notEmpty: { errorMessage: "Password Confirmation can't be empty" },
    custom: {
      options: passwordConfirmation,
      errorMessage: "Password and Password Confirmation not equal",
    },
  },
};

export const patchSchema = {
  username: {
    optional: true,
    isAlphanumeric: { errorMessage: "Username has to be Alphanumeric" },
  },
  email: {
    optional: true,
    isEmail: { errorMessage: "Email invalid, Email: john@doe.end" },
  },
  password: {
    if: (_, { req }) => req.body.password_confirm,
    notEmpty: { errorMessage: "Password can't be empty" },
    isStrongPassword: { errorMessage: "Password has to be strong" },
  },
  password_confirm: {
    if: (_, { req }) => req.body.password,
    notEmpty: { errorMessage: "Password Confirmation can't be empty" },
    custom: {
      options: passwordConfirmation,
      errorMessage: "Password and Password Confirmation not equal",
    },
  },
};
