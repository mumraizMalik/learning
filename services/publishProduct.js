const axios = require("axios");
const productPublishApi = (updatedProduct) =>
  axios.post(
    `${process.env.PRINTIFY_BASE_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`,
    updatedProduct,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_TOKEN}`,
      },
    }
  );
module.exports = productPublishApi;
