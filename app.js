const express = require("express");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const fileHelper = require("./helpers/file");
const multer = require("multer"); //image download
const path = require("path");
require("dotenv").config();
//allow to share data to another servers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/assets", express.static(path.join(__dirname, "assets"))); //public folder for images
app.use(bodyParser.json());
//configure file upload
app.use(
  multer({
    storage: fileHelper.fileStorage,
    fileFilter: fileHelper.fileFilter
  }).single("image")
);
app.use("/", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(`${process.env.MONGO_DB_API}`, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
