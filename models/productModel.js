module.exports = (sequelize, DataType) => {
  const product = sequelize.define("product", {
    title: { type: DataType.STRING, allowNull: false },
    price: { type: DataType.INTEGER, allowNull: false },
    description: { type: DataType.TEXT, allowNull: false },
    published: { type: DataType.BOOLEAN, allowNull: false },
  });
  return product;
};
