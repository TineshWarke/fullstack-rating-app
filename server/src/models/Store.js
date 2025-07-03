const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
    sequelize.define("Store", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        address: {
            type: DataTypes.STRING(400),
        },
    });
