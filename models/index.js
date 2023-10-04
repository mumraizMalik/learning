const dbConfig = require("../config/dbCofig");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    idle: dbConfig.pool.idle,
    acquire: dbConfig.pool.acquire,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to sequelize");
  })
  .catch((e) => {
    console.log(`Error in sequelize ${e}`);
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//table name products
db.products = require("./productModel.js")(sequelize, DataTypes);
db.review = require("./reviewModel.js")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("You are in Sync");
  })
  .catch(() => {
    console.log("You are not in a Sync");
  });

module.exports = db;
