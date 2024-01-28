const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter section name"],
    unique: true,
  },
  admin: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  numStudents: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Section", sectionSchema);
