const convert = require("../controllers/convertToJson");
const router = require("express").Router();
const multer = require("multer");

// const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
// router.post("/upload", convert.upload);
router.post("/upload", upload.single("file"), convert.upload);
module.exports = router;

// Define routes

module.exports = router;
