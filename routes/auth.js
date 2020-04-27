const express = require("express");
const router = express.Router();
const controller = require("../controller/auth");
const validator = require("../helpers/validator");
router.post("/login", controller.postLogin);
router.post("/signup", validator.authSignUp, controller.postSignUP);

module.exports = router;
