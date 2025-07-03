const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
const config = require("../../config");

// 🔐 JWT Token Generator
const generateToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
        },
        config.JWT_SECRET,
        { expiresIn: "2h" }
    );

// ✅ POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!name || name.length < 20 || name.length > 60)
            return res.status(400).json({ message: "Invalid name length" });

        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) return res.status(409).json({ message: "Email exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            address,
            password: hashedPassword,
            role: "user",
        });

        res.status(201).json({ message: "User registered", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = generateToken(user);
        res.status(200).json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
