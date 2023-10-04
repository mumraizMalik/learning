const db = require("../models/index");

const Product = db.products;

const addProduct = async (req, res) => {
  // try {
  const data = req.body;
  console.log(req.body);
  let info = {
    title: data.title,
    price: data.price,
    description: data.description,
    published: data.published ? data.published : false,
  };

  const product = await Product.create(info);
  res.status(200).send(product);
  // } catch {
  //   res.status(400).send("failed");
  // }
};

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll();
    res.status(200).send(products);
  } catch {
    res.status(400).send("failed");
  }
};

const getProduct = async (req, res) => {
  let id = req.params.id;
  try {
    console.log(id);
    let product = await Product.findOne({ where: { id: id } });
    res.status(200).send(product);
  } catch {
    res.status(400).send("failed");
  }
};
const updateProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.update(req.body, { where: { id: id } });
    res.status(200).send(product);
  } catch {
    res.status(400).send("failed");
  }
};
const deleteProductById = async (req, res) => {
  try {
    let id = req.params.id;
    await Product.destroy({ where: { id: id } });
    res.status(200).send("product is deleted");
  } catch {
    res.status(400).send("failed");
  }
};

const getPublichProduct = async (req, res) => {
  try {
    let product = await Product.findAll({ where: { published: true } });
    res.status(200).send(product);
  } catch {
    res.status(400).send("failed");
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProductById,
  getPublichProduct,
};
