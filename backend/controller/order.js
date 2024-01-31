const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const User = require("../model/user");
const Section = require("../model/section");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { company, user, totalPrice, quantity } = req.body;

      //Objs
      const userObj = await User.findById(user._id);
      const companyObj = await Shop.findById(company.shop._id);
      const productObj = await Product.findById(company._id);

      //Update OBJ vars
      userObj.accountBalance -= totalPrice;
      companyObj.balance += totalPrice;
      productObj.stock -= quantity;
      productObj.sold += quantity;

      //Save
      await userObj.save();
      await companyObj.save();
      await productObj.save();
      //Create Order
      const order = await Order.create({
        company: company,
        user,
        totalPrice,
        quantity,
      });

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "company.shop._id": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// admin all orders
router.get(
  "/admin-all-orders/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const adminSections = await Section.find({ "admin.id": req.params.id });
      const sectionNames = adminSections.map((section) => section.name);

      const orders = await Order.find({
        "user.section": { $in: sectionNames },
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
