const mongoose = require("mongoose");

const pendingSignupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  signupOTP: { type: String, required: true },
  signupOTPExpires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours
});

module.exports = mongoose.model("PendingSignup", pendingSignupSchema);
