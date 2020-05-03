const fs = require("fs");
const multer = require("multer"); //image download

const deleteFile = path => {
  fs.unlink(path, err => {
    if (err) {
      throw err;
    }
  });
};

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "assets"); //where to store
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

exports.fileFilter = fileFilter;
exports.fileStorage = fileStorage;
exports.deleteFile = deleteFile;
