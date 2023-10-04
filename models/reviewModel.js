module.exports = (sequelize, DataType) => {
  const review = sequelize.define("review", {
    description: { type: DataType.TEXT },
    rating: { type: DataType.INTEGER },
  });
  return review;
};
