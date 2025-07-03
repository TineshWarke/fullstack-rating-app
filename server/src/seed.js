const bcrypt = require("bcryptjs");
const { sequelize, User, Store, Rating } = require("./models");

async function seed() {
    await sequelize.sync({ force: true });

    const passwordHash = await bcrypt.hash("Admin@123", 10);

    // 👤 Admin
    const admin = await User.create({
        name: "System Administrator",
        email: "admin@example.com",
        address: "Admin HQ",
        password: passwordHash,
        role: "admin"
    });

    // 👤 Normal User
    const user = await User.create({
        name: "John Doe",
        email: "user@example.com",
        address: "123 Main Street",
        password: await bcrypt.hash("User@123", 10),
        role: "user"
    });

    // 👤 Store Owner
    const storeOwner = await User.create({
        name: "Store Manager",
        email: "owner@example.com",
        address: "Market Street",
        password: await bcrypt.hash("Owner@123", 10),
        role: "storeOwner"
    });

    // 🏪 Stores
    const store1 = await Store.create({
        name: "Alpha Mart",
        email: "alpha@store.com",
        address: "Block A",
        rating: 0,
        userId: storeOwner.id
    });

    const store2 = await Store.create({
        name: "Beta Bazaar",
        email: "beta@store.com",
        address: "Block B",
        rating: 0,
        userId: storeOwner.id
    });

    // ⭐ Sample Ratings
    await Rating.create({
        userId: user.id,
        storeId: store1.id,
        value: 4
    });

    await Rating.create({
        userId: user.id,
        storeId: store2.id,
        value: 5
    });

    // 📊 Update store average ratings
    const updateAvgRating = async (store) => {
        const ratings = await Rating.findAll({ where: { storeId: store.id } });
        const avg = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
        store.rating = avg.toFixed(2);
        await store.save();
    };

    await updateAvgRating(store1);
    await updateAvgRating(store2);

    console.log("✅ Seed data created");
}

seed();
