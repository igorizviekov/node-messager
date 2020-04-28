const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../data/keys");

exports.postLogin = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      //if no such email
      if (!user) {
        const error = new Error("No  such email");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      //if the password doesn't match
      if (!isEqual) {
        const error = new Error("No such password");
        error.statusCode = 401;
        throw error;
      }
      //configure token
      const token = jwt.sign(
        {
          userId: loadedUser._id,
          email: loadedUser.email
        },
        keys.secret,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "User Logged In",
        token: token,
        userId: loadedUser._id.toString()
      });
    })
    .catch(err => next(err));
};

exports.postSignUP = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const name = req.body.name;
  const error = validationResult(req);
  //validate
  if (!error.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: "User Created.", userId: result._id });
    })
    .catch(err => next(err));
};
