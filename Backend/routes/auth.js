const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { JWT_SECRET } = require("../config/jwt");
const { sendVerificationEmail } = require("../config/email");

// Helper function to generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    // Prevent open admin creation: only accept role='admin' when adminKey matches
    let assignedRole = 'user';
    if (role === 'admin') {
      if (process.env.ADMIN_CREATION_KEY && adminKey === process.env.ADMIN_CREATION_KEY) {
        assignedRole = 'admin';
      } else {
        return res.status(403).json({ error: 'Admin creation requires a valid adminKey' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: assignedRole });
    await user.save();
    res.json({ message: "User registered successfully", user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login success", token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Request Password Reset (sends verification code to email)
router.post("/forgot-password/request", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email address" });
    }

    // Generate 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Set expiry to 15 minutes from now
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    // Save code and expiry to user
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpires = expiryTime;
    await user.save();

    // Send email
    const emailResult = await sendVerificationEmail(email, verificationCode, user.name);

    if (!emailResult.success) {
      return res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }

    res.json({
      message: "Verification code sent to your email",
      email: email // Return email for frontend to display
    });
  } catch (err) {
    console.error("Forgot password request error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// Verify Code
router.post("/forgot-password/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if code exists and hasn't expired
    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
      return res.status(400).json({ error: "No verification code found. Please request a new one." });
    }

    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Code is valid
    res.json({
      message: "Verification successful",
      verified: true
    });
  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// Reset Password (after verification)
router.post("/forgot-password/reset", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify code one more time
    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Verification code has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// Change Password
router.post("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid old password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get current user profile
router.get("/me", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User found:", user); // Debug log

    res.json({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "user"
    });
  } catch (err) {
    console.error("JWT verification error:", err); // Debug log
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
