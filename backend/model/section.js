const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter section name"],
  },
  settings: [
    {
      investmentCost: {
        type: Number,
        default: 20000,
      },
      totalNumberInvestments: {
        type: Number,
        default: 32,
      },
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchema);
