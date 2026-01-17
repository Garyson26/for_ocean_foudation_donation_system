const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const donationRoutes = require("./routes/donations");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payment");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For PayU form data
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

// Fallback routes for PayU callbacks (redirect to payment routes)
// PayU sometimes strips the /api/payment prefix, so we handle both
app.use("/webhook", paymentRoutes);
app.use("/success", paymentRoutes);
app.use("/failure", paymentRoutes);
app.use("/cancel", paymentRoutes);


// Connect Database
connectDB();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
