const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
const storeRoutes = require("./routes/store");
app.use("/api/stores", storeRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("API is running.");
});

// Start server
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Database connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Unable to connect to database:", err);
    });
