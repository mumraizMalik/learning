const axios = require("axios");
const getVariants = async (printprovidersIds, darkColors, lightColors) => {
  console.log("darkColors", darkColors);
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
          return darkColors.includes(
            currentVariants?.options?.color.toLowerCase()
          );
        });
        let requiredVariants2 = response.data.variants.filter(function (
          currentVariants
        ) {
          return lightColors.includes(
            currentVariants?.options?.color.toLowerCase()
          );
        });

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
