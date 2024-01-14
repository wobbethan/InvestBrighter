const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your event name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your event description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your event category!"],
  },
  start_Date: {
    type: Date,
    required: true,
  },
  finish_Date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Running",
  },
  tags: {
    type: String,
    required: [true, "Please enter your event tags!"],
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your event discount price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your event stock!"],
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
