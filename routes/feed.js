const express = require("express");
const router = express.Router();
const controller = require("../controller/feed");
const validator = require("../helpers/validator");
const authValidator = require("../helpers/isAuth");

router.get("/feed", authValidator, controller.getFeed);
router.post("/new", authValidator, validator.post, controller.postPost);
router.delete("/delete", authValidator, controller.deletePost);
router.put("/update", authValidator, validator.post, controller.postUpdatePost);
module.exports = router;
