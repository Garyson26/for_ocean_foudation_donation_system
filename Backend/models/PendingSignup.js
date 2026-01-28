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

// Indexes for better query performance
pendingSignupSchema.index({ createdAt: 1 }); // For cleanup queries
pendingSignupSchema.index({ email: 1 }); // For email lookups

module.exports = mongoose.model("PendingSignup", pendingSignupSchema);
