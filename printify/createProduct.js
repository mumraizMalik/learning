const arr = [
  {
    blueprintId: "33",
    "Print Provider": "Monster Digital",
    Colors: "black,light blue, pink, heather, white",
    Sizes: "6m-24m",
    "Print area": "Front",
    "Image url":
      "https://cdn.discordapp.com/attachments/1131547046323695666/1150793546463449129/09sp-uniwatch-inyt4-mediumSquareAt3X.jpg",
    "End Price // Profit": "24.95",
    title: "Potty Head - Baby Onesie",
    description: "DESIGN-SKU: a100",
    Tags: "group-100",
  },
  {
    blueprintId: "672",
    "Print Provider": "SwiftPOD,Ink Blot",
    Colors: "black,light blue, pink, heather, white",
    Sizes: "6m-24m",
    "Print area": "Front",
    "Image url":
      "https://cdn.discordapp.com/attachments/1131547046323695666/1150793546736087112/Shinola-S0120250982_LIFESTYLE_01_1800x.png",
    "End Price // Profit": "30.95",
    title: "Cropped T-Shirt",
    description: "Cropped T-Shirt",
    Tags: "group-100",
  },
];
const axios = require("axios");
const getPrintProvider = require("../printify/getPrintProvider");
const getVariants = require("../printify/getVariants");
const uploadImage = require("../printify/uploadImage");

const createProducts = async (arr) => {
  let arrayOfFailedProducts = [];

  // await arr.map(async (arr[i], i) =>
  for (let i = 0; i < arr.length; i++) {
    const product = {
      blueprintId: arr[i].blueprintId * 1,
      printProviders: arr[i]["Print Provider"].split(","),
      colors: arr[i].Colors.split(","),
      printArea: arr[i]["Print area"].split(","),
      url: arr[i]["Image url"],
      title: arr[i].title,
      description: arr[i].description,
      tags: arr[i].Tags.split(","),
      price: arr[i]["End Price // Profit"] * 100,
    };
    const imageResponse = await uploadImage(product.url + i, product.url);
    if (imageResponse?.id) {
      console.log(imageResponse);
    } else {
      arrayOfFailedProducts.push({ ...arr[i], ...imageResponse.errors });
      console.log("ImageUploadFailed=========?", imageResponse.errors.reason);
      continue;
      // return;
    }
    let print_areas = [
      {
        variant_ids: [],
        placeholders: [
          {
            position: "front",
            images: [
              {
                id: imageResponse?.id,
                x: 0.5,
                y: 0.5,
                scale: 1.5,
                angle: 0,
              },
            ],
          },
          {
            position: "back",
            images: [
              {
                id: imageResponse?.id,
                x: 0.5,
                y: 0.5,
                scale: 1.5,
                angle: 0,
              },
            ],
          },
        ],
      },
    ];
    const printprovidersIds = await getPrintProvider(
      product.blueprintId,
      product.printProviders
    );
    const variants = await getVariants(printprovidersIds, product.colors);
    variants.map(async (item) => {
      let variant_ids = item.variants.map((obj) => obj.id);
      item.variants = item.variants.map((item) => ({
        ...item,
        price: product.price,
      }));
      print_areas[0].variant_ids = variant_ids;
      console.log("print_areas", print_areas.placeholders);
      let updatedProduct = {
        blueprint_id: item.blueprintId,
        print_provider_id: item.printProviderId,
        title: product.title,
        description: product.description,
        tags: product.tags,
        print_areas: print_areas,
        variants: item.variants,
      };
      try {
        const response = await axios.post(
          `${process.env.PRINTIFY_BASE_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`,
          updatedProduct,
          {
            headers: {
              Authorization: `Bearer ${process.env.PRINTIFY_TOKEN}`,
            },
          }
        );
        // console.log(response.data);
        console.log("......");
      } catch (e) {
        console.log("===Error===>", e.response.data);
      }
    });
  }

  console.log(
    "ArrayFailedProducts==========================>",
    arrayOfFailedProducts.length
  );
};

module.exports = createProducts;
