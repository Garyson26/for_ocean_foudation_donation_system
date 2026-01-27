const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: String },
  address: { type: String },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  resetPasswordCode: { type: String },
  resetPasswordExpires: { type: Date },
  loginOTP: { type: String },
  loginOTPExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
