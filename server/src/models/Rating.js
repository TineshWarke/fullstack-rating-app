const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
    sequelize.define("Rating", {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
    });
