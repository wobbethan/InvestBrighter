const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sections: [
    {
      type: String,
      required: true,
    },
  ],
  start_Date: {
    type: String,
  },
  finish_Date: {
    type: String,
  },
  status: {
    type: String,
    default: "Running",
  },
  images: [
    {
      type: String,
    },
  ],
  maxInvestmentsCompany: {
    type: Number,
    default: 32,
  },
  maxInvestmentsRound: {
    type: Number,
    default: 20,
  },
  numInvestments: {
    type: Number,
    default: 0,
  },
  numChecks: {
    type: Number,
    default: 3,
  },
  checkPrice: {
    type: Number,
    default: 20000,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
