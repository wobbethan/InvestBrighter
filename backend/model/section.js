const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter section name"],
    unique: true,
  },
  admin: {
    type: String,
  },
  numStudents: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Section", sectionSchema);
