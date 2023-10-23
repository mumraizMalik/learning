const express = require("express");
const cors = require("cors");
const app = express();
require("./services/config")(app);
const PORT = process.env.PORT || 4000;
const router = require("./router/productRouter");
const fileRouter = require("./router/uploadProductRouter");
// const getPrintProvider = require("./printify/getPrintProvider");
// const getVariants = require("./printify/getVariants");
const uploadImage = require("./printify/uploadImage");
// const createProducts = require("./printify/createProduct");

let corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/products", router);
app.use("/api/file", fileRouter);
app.get("/", (req, res) => {
  res.json({ message: "Hi, From Server!" });
});
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

const test = async () => {
  // const printprovidersIds = await getPrintProvider(33, [
  //   "Monster Digital",
  //   "SwiftPOD",
  // ]);
  // let colors = ["white", "black", "light blue", "pink", "heather"];
  // const variants = await getVariants(printprovidersIds, colors);
  // console.log("variants", variants);
};
// test();

// createProducts();
// const uploadImages = async () => {
//   const img =
//     "https://cdn.discordapp.com/attachments/1131547046323695666/1150793487978090616/2022-Top-Brand-Luxury-Men-s-Watch-30m-Waterproof-Date-Clock-Male-Sports-Watches-Men-Quartz.jpg";
//   const response = await uploadImage(img, img);
//   console.log(response);
// };
// uploadImages();
