const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const User = require("../models/User");

// Attach a normalized `req.user` with `id`, `name`, and `role`.
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization") || req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const raw = token.split && token.split(" ")[1] ? token.split(" ")[1] : token.replace("Bearer ", "");
    const decoded = jwt.verify(raw, JWT_SECRET);

    // Ensure we have userId in token
    const userId = decoded.userId || decoded.id || decoded.user || null;
    if (!userId) return res.status(401).json({ msg: "Invalid token payload" });

    // Fetch user to attach name and role (keeps middleware idempotent)
    const user = await User.findById(userId).select("name role");
    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role || decoded.role || "user"
    };

    next();
  } catch (err) {
    console.error("Auth middleware JWT error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
