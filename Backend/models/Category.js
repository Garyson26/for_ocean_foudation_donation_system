const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sortDescription: {
    type: String,
    required: true,
  },
  donationAmount: {
    type: Number,
    required: true,
  },
  descriptions: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model("Category", categorySchema);
