const csvToJson = require("csv-file-to-json");
const createProducts = require("../printify/createProduct");

const upload = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }
    const dataInJSON = csvToJson({
      filePath: `./uploads/${req.file.originalname}`,
    });
    // console.log("dataInJSON", dataInJSON);
    createProducts(dataInJSON);

    res.send("File uploaded successfully!");
  } catch (error) {
    console.error("File upload failed:", error.message);
    res.status(500).send("File upload failed. Please try again.");
  }
};

module.exports = { upload };
