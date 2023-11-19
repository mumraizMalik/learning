const csvToJson = require("csv-file-to-json");
const createProducts = require("../printify/createProduct");
const path = require("path");
const fs = require("fs");
const upload = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }
    const dataInJSON = csvToJson({
      filePath: `./uploads/${req.file.originalname}`,
    });
    // console.log("dataInJSON", dataInJSON);
    const jsonUpload = await createProducts(dataInJSON);
    console.log("json", jsonUpload);
    if (jsonUpload == true || jsonUpload == "Success") {
      res.json("Products uploaded successfully!");
    } else if (jsonUpload == "file") {
      const filePath = path.resolve("Files/failProducts.csv");

      if (!fs.existsSync(filePath)) {
        // Handle the case where the file does not exist
        res.status(404).send("File not found");
        return;
      }

      const fileStream = fs.createReadStream(filePath);
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=failProducts.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      fileStream.pipe(res);
      // res.contentType("application/csv");
      // res.setHeader(
      //   "Content-Disposition",
      //   'attachment; filename="failProducts.csv"'
      // );

      // res.download(filePath);
    } else res.send("Something went wrong in getting failed products");
  } catch (error) {
    console.error("File upload failed:", error.message);
    res.status(500).json("File upload failed. Please try again.");
  }
};

module.exports = { upload };
