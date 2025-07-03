const mysql = require("mysql2/promise");
const { sequelize, User, Store, Rating } = require("./models");
const bcrypt = require("bcrypt");
const config = require("../config");

const seed = async () => {
    // Step 1: Ensure database exists
    const connection = await mysql.createConnection({
        host: config.DB.HOST,
        user: config.DB.USER,
        password: config.DB.PASSWORD,
        port: config.DB.PORT,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.DB}\`;`);
    console.log(`✅ Database "${config.DB.DB}" ensured`);
    await connection.end();

    // Step 2: Sync models
    await sequelize.sync({ force: true }); // Drop & recreate tables
    console.log("✅ Tables created");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
        name: "System Administrator Admin",
        email: "admin@example.com",
        password: hashedPassword,
        address: "Admin Address",
        role: "admin",
    });

    const owner = await User.create({
        name: "Owner User Name 123456789",
        email: "owner@example.com",
        password: hashedPassword,
        address: "Owner Address",
        role: "owner",
    });

    const user = await User.create({
        name: "Normal User Name 123456789",
        email: "user@example.com",
        password: hashedPassword,
        address: "User Address",
        role: "user",
    });

    const store = await Store.create({
        name: "Coffee Shop",
        email: "store@example.com",
        address: "123 Market Street",
        ownerId: owner.id,
    });

    await Rating.create({
        rating: 5,
        StoreId: store.id,
        UserId: user.id,
    });

    console.log("✅ Seed data inserted");
};

seed();
