const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

// Update profile
router.put("/profile", async (req, res) => {
  // Expecting token in Authorization header
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    console.log("Update request body:", req.body); // Debug log
    console.log("User ID from token:", decoded.userId); // Debug log

    const updateFields = {};
    ["name", "phone", "address"].forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    console.log("Update fields:", updateFields); // Debug log

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Updated user:", user);
    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
