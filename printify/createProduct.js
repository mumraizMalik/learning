const arr = [
  {
    blueprintId: "33",
    "Print Provider": "Monster Digital",
    darkColors: "black,light blue, pink, heather, white",
    Sizes: "6m-24m",
    "Print area": "Front",
    "End Price // Profit": "24.95",
    title: "Potty Head - Baby Onesie",
    description: "DESIGN-SKU: a100",
    Tags: "group-100",
    "Image url":
      "https://cdn.discordapp.com/attachments/1131547046323695666/1155041851586396191/5.jpg",
    lightColors: "gray,pink",
    lightImage: "",
    scale: "1",
    topPercentage: "0",
    imageId: "652e7348bcdd2047911a6b12",
  },
  {
    blueprintId: "672",
    "Print Provider": "SwiftPOD,Ink Blot",
    darkColors: "black,light blue, pink, heather, white",
    Sizes: "6m-24m",
    "Print area": "Front",
    "End Price // Profit": "30.95",
    title: "Cropped T-Shirt",
    description: "Cropped T-Shirt",
    Tags: "group-100",
    "Image url":
      "https://cdn.discordapp.com/attachments/1131547046323695666/1150793487978090616/2022-Top-Brand-Luxury-Men-s-Watch-30m-Waterproof-Date-Clock-Male-Sports-Watches-Men-Quartz.jpg",
    lightColors: "pink",
    lightImage:
      "https://cdn.discordapp.com/attachments/1131547046323695666/1155041851586396191/5.jpg",
    scale: "1.5",
    topPercentage: "0",
    imageId: "653135a62e71bd7f6dcd67de",
  },
];
const axios = require("axios");
const getPrintProvider = require("../printify/getPrintProvider");
const getVariants = require("../printify/getVariants");
const uploadImage = require("../printify/uploadImage");
const productPublishApi = require("../services/publishProduct");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const createProducts = async (arr) => {
  let arrayOfFailedProducts = [];

  // await arr.map(async (arr[i], i) =>
  const sizesArray = (size) => {
    try {
      let Sizes1 = ["6M", "12M", "18M", "24M"];
      let Sizes2 = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

      const sizes = size.toUpperCase().split("-");
      let checkArray = Sizes1.includes(sizes[0])
        ? Sizes1.splice(Sizes1.indexOf(sizes[0]), Sizes1.indexOf(sizes[1]) + 1)
        : Sizes2.splice(Sizes2.indexOf(sizes[0]), Sizes2.indexOf(sizes[1]) + 1);

      return checkArray;
    } catch {
      console.log("checkArrayCatch");
      return [];
    }
  };
  for (let i = 0; i < arr.length; i++) {
    let newSize = [];

    const product = {
      blueprintId: arr[i].blueprintId * 1,
      printProviders: arr[i]["Print Provider"].split(","),
      // colors: colors,
      // printArea: arr[i]["Print area"].split(","),
      url: arr[i]["Image url"],
      title: arr[i].title,
      description: arr[i].description,
      tags: arr[i].Tags.split(","),
      price: arr[i]["End Price // Profit"] * 100,
      percentage: calculatePercentage(arr[i].topPercentage),
      scale: arr[i].scale,
      imageId: arr[i].imageId,
      backImageId: arr[i]?.backImageId ?? null,
      lightImage: arr[i].lightImage ?? null,
      backImageIdLight: arr[i].backImageIdLight ?? null,
      lightColors: arr[i]?.lightColors.split(","),
      darkColors: arr[i]?.darkColors.split(","),
      sizes: sizesArray(arr[i].Sizes),
    };
    let imagesUrl = [
      product?.ImageId,
      product?.backImageId,
      product?.lightImage,
      product?.backImageIdLight,
    ];
    const promises = [];
    for (let i = 0; i < 4; i++) {
      if (imagesUrl[i]) {
        const imageResponse = await uploadImage(imagesUrl[i], imagesUrl[i]);
        promises.push(imageResponse);
        // if (imageResponse?.id) {
        //   console.log(imageResponse);
        // } else {
        //   arrayOfFailedProducts.push({ ...arr[i], ...imageResponse.errors });
        //   console.log(
        //     "ImageUploadFailed=========?",
        //     imageResponse.errors.reason
        //   );
        //   continue;
        //   // return;
        // }
      }
    }
    Promise.all(promises)
      .then((results) => {
        console.log("Result");
        for (let k = 0; k < results.length; k++) {
          if (product.imageId == results[k].name)
            product.imageId = results[k].id;
          else if (product.backImageId == results[k].name)
            product.imageId = results[k].id;
          else if (product.lightImage == results[k].name)
            product.imageId = results[k].id;
          else if (product.backImageIdLight == results[k].name)
            product.imageId = results[k].id;
        }
      })
      .catch((imageResponse) => {
        console.log("ImagesCatch", imageResponse);
        arrayOfFailedProducts.push({ ...arr[i], ...imageResponse.errors });
      });
    const printprovidersIds = await getPrintProvider(
      product.blueprintId,
      product.printProviders
    );
    const variants = await getVariants(
      printprovidersIds,
      product.darkColors,
      product.lightColors,
      product.sizes,
      product.price
    );
    for (j = 0; j < variants.length; j++) {
      let print_areas = [
        {
          variant_ids: [],
          placeholders: [
            {
              position: "front",
              images: [
                {
                  id: "",
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0,
                },
              ],
            },
            {
              position: "back",
              images: [
                {
                  id: "",
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0,
                },
              ],
            },
          ],
        },
      ];
      let variant_ids1 = variants[j].variants1.map((obj) => obj.id);
      // variants[j].variants1 = variants[j].variants1.map((item) => ({
      //   ...item,
      //   price: product.price,
      // }));
      let variant_ids2 = variants[j].variants2.map((obj) => obj.id);
      // variants[j].variants2 = variants[j]?.variants2.map((item) => ({
      //   ...item,
      //   price: product.price,
      // }));

      let newPrintArea = await updatedPrintArea(
        print_areas,
        product,
        variant_ids1,
        (variant_ids2 = variant_ids2.length > 0 ? variant_ids2 : null),
        (loop = variant_ids2?.length > 0 ? 2 : 1)
      );

      let updatedProduct = {
        blueprint_id: variants[j].blueprintId,
        print_provider_id: variants[j].printProviderId,
        title: product.title,
        description: product.description,
        tags: product.tags,
        print_areas: newPrintArea,
        variants: [...variants[j].variants1, ...variants[j].variants2],
      };
      try {
        const response = await productPublishApi(updatedProduct);
        // console.log(response.data);
        console.log("......");
      } catch (e) {
        // console.log("===Error===>", e.response.data);
        if (arrayOfFailedProducts.length > 0) {
          if (
            !arrayOfFailedProducts.some(
              (obj) => obj.blueprintId == arr[i].blueprintId
            )
          ) {
            arrayOfFailedProducts.push({
              ...arr[i],
              reason: e.response.data?.errors?.reason,
            });
          } else console.log();
        } else
          arrayOfFailedProducts.push({
            ...arr[i],
            reason: e.response.data?.errors?.reason,
          });
      }
    }
  }
  const csvWriter = createCsvWriter({
    path: "Files/failProducts.csv",
    header: [
      { id: "blueprintId", name: "blueprintId" },
      { id: "Print Provider", name: "Print Provider" },
      { id: "reason", name: "reason" },
      // { id: "darkColors", name: "darkColors" },
      // { id: "Sizes", name: "Sizes" },
      // { id: "End Price // Profit", name: "End Price // Profit" },
      // id:title: "Cropped T-Shirt",
      // id:description: "Cropped T-Shirt",
      // id:Tags: "group-100",
      // id:lightColors: "white,pink candy",
      // id:lightImage: "65293b09848e0656bfc745b8",
      // id:scale: "0.5",
      // id:topPercentage: "0",
      // id:imageId: "6529376ccbd0883f4b21ce12Q",
      // id:backImageId: "",
      // id:backImageIdLight: undefined,
      // id:status: "error",
      // code: 8253,
      // message: "Operation failed.",
      // errors: { reason: "Provided images do not exist", code: 8253 },
    ],
  });
  const response = await csvWriter
    .writeRecords(arrayOfFailedProducts) // returns a promise
    .then(() => {
      return true;
    })
    .catch((e) => {
      return false;
    });
  if (arrayOfFailedProducts.length == 0) {
    return "Success";
  } else if (response) {
    return "file";
  } else {
    return "failed";
  }

  // console.log("ArrayFailedProducts", arrayOfFailedProducts);
};

const calculatePercentage = (percentage) => {
  if (percentage == 0) return 0.5;
  else if (percentage == 10) return 0.6;
  else if (percentage == 20) return 0.7;
  else if (percentage == 30) return 0.8;
  else if (percentage == 40) return 0.9;
  else if (percentage == 50) return 1;
  else if (percentage == 60) return 1.1;
  else if (percentage == 70) return 1.2;
  else if (percentage == 80) return 1.3;
  else if (percentage == 90) return 1.4;
  else if (percentage == 100) return 1.5;
  else return 0;
};

const updatedPrintArea = (
  print_areas,
  product,
  variant_ids1,
  variant_ids2,
  loop
) => {
  const newPrintArea = JSON.parse(JSON.stringify(print_areas));
  if (loop == 2) {
    newPrintArea.push(print_areas[0]);
  }
  for (let i = 0; i < loop; i++) {
    newPrintArea[i].placeholders[0].images[0].y = product.percentage;
    newPrintArea[i].placeholders[0].images[0].scale = product.scale;

    if (i == 0) {
      newPrintArea[i].variant_ids = variant_ids1;
      newPrintArea[i].placeholders[0].images[0].id = product.imageId;
      if (product?.backImageId) {
        newPrintArea[i].placeholders[1].images[0].y = product.percentage;
        newPrintArea[i].placeholders[1].images[0].scale = product.scale;
        newPrintArea[i].placeholders[1].images[0].id = product.backImageId;
      } else {
        newPrintArea[i].placeholders.pop();
      }
    } else if (i == 1) {
      newPrintArea[i].variant_ids = variant_ids2;
      newPrintArea[i].placeholders[0].images[0].id = product?.lightImage;
      if (product?.backImageIdLight) {
        newPrintArea[i].placeholders[1].images[0].x = product.percentage;
        newPrintArea[i].placeholders[1].images[0].scale = product.scale;
        newPrintArea[i].placeholders[1].images[0].id = product.backImageIdLight;
      } else {
        newPrintArea[i].placeholders.pop();
      }
    }
  }

  // console.log("newPrintArea", JSON.stringify(newPrintArea));
  return newPrintArea;
};
const uploadImages = () => {};
module.exports = createProducts;
