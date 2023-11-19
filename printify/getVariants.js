const axios = require("axios");
const pricefromsize = {
  "6M": 0,
  "12M": 200,
  "18M": 400,
  "24M": 600,
  S: 0,
  M: 200,
  L: 400,
  XL: 600,
  "2XL": 800,
  "3Xl": 1600,
};
const getVariants = async (
  printprovidersIds,
  darkColors,
  lightColors,
  sizes,
  price
) => {
  console.log("lightColors", lightColors);
  if (printprovidersIds.length < 1) return null;

  const finalArray = [];
  const promises = printprovidersIds.map(async (item) => {
    return new Promise(async (res, rej) => {
      try {
        const response = await axios.get(
          `${process.env.PRINTIFY_BASE_URL}/catalog/blueprints/${item.blueprintId}/print_providers/${item.printProviderId}/variants.json`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PRINTIFY_TOKEN}`,
            },
          }
        );

        let requiredVariants1 = response.data.variants.filter(function (
          currentVariants
        ) {
          return (
            darkColors.includes(
              currentVariants?.options?.color.toLowerCase()
            ) &&
            (sizes.includes(currentVariants?.options?.size) ||
              sizes.length == 0)
          );
        });
        let requiredVariants2 = response.data.variants.filter(function (
          currentVariants
        ) {
          return (
            lightColors.includes(
              currentVariants?.options?.color.toLowerCase()
            ) &&
            (sizes.includes(currentVariants?.options?.size) ||
              sizes.length == 0)
          );
        });
        requiredVariants1 = requiredVariants1.map((item) => ({
          ...item,
          price: pricefromsize[item.options?.size]
            ? pricefromsize[item.options?.size] + price
            : 0 + price,
        }));
        requiredVariants2 = requiredVariants2.map((item) => ({
          ...item,
          price: pricefromsize[item.options?.size]
            ? pricefromsize[item.options?.size] + price
            : 0 + price,
        }));

        res({
          variants1: requiredVariants1,
          variants2: requiredVariants2,
          ...item,
        });
      } catch {}
    });
  });

  finalArray.push(...(await Promise.all(promises)));
  //   console.log("result>>>", finalArray[0].variants[0].placeholders);
  return finalArray;
};

module.exports = getVariants;
