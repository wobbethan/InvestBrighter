const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
  },
  section: {
    type: String,
    required: [true, "Please enter section!"],
  },

  price: {
    type: Number,
    required: [true, "Please enter your product discount price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  start_Date: {
    type: String,
  },
  finish_Date: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
