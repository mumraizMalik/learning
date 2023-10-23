const productController = require("../controllers/productController");

const router = require("express").Router();
router.post("/addProduct", productController.addProduct);
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProduct/:id", productController.getProduct);
router.put("/updateProduct/:id", productController.updateProduct);
router.delete("/deleteProductById/:id", productController.deleteProductById);
router.get("/publichProduct", productController.getPublichProduct);

module.exports = router;
