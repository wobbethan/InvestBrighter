const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop.js");
const Section = require("../model/section.js");
const Event = require("../model/event.js");
const User = require("../model/user.js");
const cloudinary = require("cloudinary");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");

//create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop ID invalid", 400));
      } else {
        const productData = req.body;
        productData.shop = shop;
        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//Getting all products of company
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//delete product

router.delete(
  "/delete-company-products/:eventId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({
        eventId: req.params.eventId,
      });

      products.forEach(async (product) => {
        const deleteProduct = await Product.findByIdAndDelete(product._id);
      });

      res.status(201).json({
        success: true,
        message: "Product successfully deleted!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products-admin/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const adminSections = await Section.find({ "admin.id": req.params.id });
      const sectionNames = adminSections.map((section) => section.name);

      const products = await Product.find({ section: { $in: sectionNames } });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products section
router.get(
  "/get-all-products-section/:section",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ section: req.params.section });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products event
router.get(
  "/get-all-products-event/:section",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.params.section);

      const events = await Event.find({
        sections: { $in: [req.params.section] },
      });
      console.log(events);

      const eventIds = events.map((event) => event._id);

      const products = await Product.find({ eventId: { $in: eventIds } });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//Getting shop from product
router.get(
  "/get-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
