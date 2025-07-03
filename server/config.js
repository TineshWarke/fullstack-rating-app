require("dotenv").config();

module.exports = {
    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DB: process.env.DB_NAME,
        DIALECT: "mysql",
        PORT: process.env.DB_PORT || 3306,
    },
    JWT_SECRET: process.env.JWT_SECRET,
};
