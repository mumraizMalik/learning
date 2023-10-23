const axios = require("axios");
const getVariants = async (printprovidersIds, colors) => {
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

        let requiredVariants = response.data.variants.filter(function (
          currentVariants
        ) {
          return !colors.includes(currentVariants);
        });
        res({ variants: requiredVariants, ...item });
      } catch {}
    });
  });

  finalArray.push(...(await Promise.all(promises)));
  //   console.log("result>>>", finalArray[0].variants[0].placeholders);
  return finalArray;
};

module.exports = getVariants;
