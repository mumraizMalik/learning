const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
const router = require("./router/productRouter");

let corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", router);
app.get("/", (req, res) => {
  res.json({ message: "Hi, From Server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
