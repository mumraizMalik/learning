const axios = require("axios");

const uploadImage = async (file_name, url) => {
  try {
    const response = await axios.post(
      `${process.env.PRINTIFY_BASE_URL}/uploads/images.json`,
      {
        file_name,
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    // console.log("ImageUploadFailed", e.response.data);
    return e.response.data;
  }
};

module.exports = uploadImage;
