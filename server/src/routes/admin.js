const express = require("express");
const router = express.Router();
const { User, Store, Rating } = require("../models");
const requireAuth = require("../middleware/requireAuth");

// Protect all admin routes
router.use(requireAuth(["admin"]));

// 📊 Admin Dashboard Stats
router.get("/dashboard", async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        res.status(500).json({ error: "Failed to load dashboard stats" });
    }
});

// 👤 Add User
router.post("/add-user", async (req, res) => {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        const user = await User.create({ name, email, password, address, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to add user" });
    }
});

// 🏪 Get All Stores
router.get("/stores", async (req, res) => {
    const { name, email, address } = req.query;
    const where = {};

    if (name) where.name = name;
    if (email) where.email = email;
    if (address) where.address = address;

    try {
        const stores = await Store.findAll({ where });
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stores" });
    }
});

// 👥 Get All Users (normal + admin)
router.get("/users", async (req, res) => {
    const { name, email, address, role } = req.query;
    const where = {};

    if (name) where.name = name;
    if (email) where.email = email;
    if (address) where.address = address;
    if (role) where.role = role;

    try {
        const users = await User.findAll({ where });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;
