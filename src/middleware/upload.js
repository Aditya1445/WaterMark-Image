const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, cb) {
    console.log(file.mimetype);
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    }
     else {
      cb(null, false);
      return cb(new Error("Please upload an image of suitable file format"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
module.exports = upload;
