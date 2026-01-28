const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
    required: true,
  },
  donorPhone: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow guest donations without userId
  },
  item: {
    type: String,
    required: false, // Made optional since item field was removed
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  amount: {
    type: Number,
    required: true,
  },
  baseAmount: {
    type: Number,
    required: false,
    default: 0,
  },
  extraAmount: {
    type: Number,
    required: false,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  // Payment related fields
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Cancelled"],
    default: "Pending",
  },
  transactionId: {
    type: String,
    default: null,
  },
  paymentDetails: {
    mihpayid: String,
    amount: Number,
    mode: String,
    bank_ref_num: String,
    paymentDate: Date,
    status: String, // PayU status response
    error_Message: String, // Error message if payment failed
  },
  failureReason: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Indexes for better query performance
donationSchema.index({ createdAt: 1 }); // For data cleanup queries
donationSchema.index({ userId: 1 }); // For user-based queries
donationSchema.index({ paymentStatus: 1 }); // For payment status filtering
donationSchema.index({ category: 1 }); // For category-based queries

module.exports = mongoose.model("Donation", donationSchema);
