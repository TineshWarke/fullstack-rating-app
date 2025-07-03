const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const requireAuth = require("../middleware/requireAuth");

// 🔍 Get All Stores (for users)
router.get("/", requireAuth(["user"]), async (req, res) => {
    try {
        const stores = await Store.findAll();
        const storeRatings = await Rating.findAll({ where: { userId: req.user.id } });

        const storeList = stores.map(store => {
            const userRating = storeRatings.find(r => r.storeId === store.id);
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                avgRating: store.rating,
                userRating: userRating ? userRating.value : null
            };
        });

        res.json(storeList);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stores" });
    }
});

// ⭐ Submit or Update Rating (for users)
router.post("/rate/:storeId", requireAuth(["user"]), async (req, res) => {
    const { value } = req.body;
    const { storeId } = req.params;

    if (value < 1 || value > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
        let rating = await Rating.findOne({ where: { userId: req.user.id, storeId } });

        if (rating) {
            rating.value = value;
            await rating.save();
        } else {
            rating = await Rating.create({ userId: req.user.id, storeId, value });
        }

        // Recalculate store average rating
        const allRatings = await Rating.findAll({ where: { storeId } });
        const avg = allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length;

        const store = await Store.findByPk(storeId);
        store.rating = avg.toFixed(2);
        await store.save();

        res.json({ message: "Rating submitted", rating });
    } catch (err) {
        res.status(500).json({ error: "Failed to submit rating" });
    }
});

// 📊 Store Owner Dashboard: Get My Store Ratings
router.get("/owner/ratings", requireAuth(["storeOwner"]), async (req, res) => {
    try {
        const store = await Store.findOne({ where: { userId: req.user.id } });

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{ model: User, attributes: ["name", "email"] }]
        });

        res.json({
            store: store.name,
            avgRating: store.rating,
            ratings: ratings.map(r => ({
                user: r.User.name,
                email: r.User.email,
                value: r.value
            }))
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch store ratings" });
    }
});

module.exports = router;
