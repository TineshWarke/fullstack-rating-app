const { Sequelize } = require("sequelize");
const config = require("../../config");

const sequelize = new Sequelize(
    config.DB.DB,
    config.DB.USER,
    config.DB.PASSWORD,
    {
        host: config.DB.HOST,
        dialect: config.DB.DIALECT,
        port: config.DB.PORT,
        logging: false,
    }
);

// Import models
const User = require("./User")(sequelize);
const Store = require("./Store")(sequelize);
const Rating = require("./Rating")(sequelize);

// Associations
User.hasMany(Rating);
Rating.belongsTo(User);

Store.hasMany(Rating);
Rating.belongsTo(Store);

Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" }); // Store Owner

module.exports = {
    sequelize,
    User,
    Store,
    Rating,
};
