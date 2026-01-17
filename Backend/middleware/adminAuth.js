const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  const token = req.headers["authorization"] || req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const raw = token.split && token.split(" ")[1] ? token.split(" ")[1] : token.replace("Bearer ", "");
    const decoded = jwt.verify(raw, JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded.user || null;
    if (!userId) return res.status(401).json({ message: "Invalid token payload" });

    const user = await User.findById(userId).select("name role");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    req.user = { id: user._id.toString(), name: user.name, role: user.role };
    next();
  } catch (err) {
    console.error("Admin auth JWT error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminAuth;
