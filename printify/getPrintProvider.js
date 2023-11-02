const axios = require("axios");

const getPrintProvider = async (blueprintId, print_providers) => {
  try {
    const response = await axios.get(
      `${process.env.PRINTIFY_BASE_URL}/catalog/blueprints/${blueprintId}/print_providers.json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_TOKEN}`,
        },
      }
    );
    let printprovidersIds = [];
    response.data?.map((item) => {
      if (print_providers.includes(item.title)) {
        printprovidersIds.push({
          printProviderId: item.id,
          blueprintId: blueprintId,
        });
      }
    });

    return printprovidersIds;
  } catch {}
};

module.exports = getPrintProvider;
