const { body } = require("express-validator");
const User = require("../models/user");

exports.authSignUp = [
  body("password")
    .isLength({ min: 5 })
    .trim(),
  body("email")
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("Email already exists.");
        }
      });
    })
    .normalizeEmail(),
  body("name")
    .trim()
    .not()
    .isEmpty()
];

exports.post = [
  body("title")
    .trim()
    .isString()
    .isLength({ min: 3 }),
  body("content")
    .trim()
    .isString()
    .isLength({ min: 8, max: 200 })
];
