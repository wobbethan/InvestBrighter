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
const Event = require("../model/event");

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
      const eventObj = await Event.findById(productObj.eventId);

      let roundEnded,
        roundStarted = null;
      const currentDate = new Date();
      if (
        productObj.start_Date !== "undefined" &&
        productObj.finish_Date !== "undefined"
      ) {
        const startDate = new Date(productObj.start_Date);
        const endDate = new Date(productObj.finish_Date);
        roundStarted = currentDate > startDate;
        roundEnded = currentDate > endDate;
      }

      if (productObj.stock < quantity) {
        res.status(201).json({
          success: false,
          message: `${productObj.stock} investments of ${companyObj.name} remaining`,
        });
        return next(
          new ErrorHandler(
            `Only ${productObj.stock} investments of ${companyObj.name} remaining`,
            500
          )
        );
      } else if (user.role !== "admin") {
        if (eventObj.status === "Locked") {
          res.status(201).json({
            success: false,
            message: `The event is now locked`,
          });
          return next(new ErrorHandler(`The event is now locked`, 500));
        } else if (roundEnded === true) {
          res.status(201).json({
            success: false,
            message: `The event has concluded`,
          });
          return next(new ErrorHandler(`The event has concluded`, 500));
        } else if (roundStarted === false) {
          res.status(201).json({
            success: false,
            message: `Unable to invest until round has started`,
          });
          return next(
            new ErrorHandler(`Unable to invest until round has started`, 500)
          );
        }
      } else {
        //Update OBJ vars
        userObj.accountBalance -= totalPrice;
        companyObj.balance += totalPrice;
        companyObj.totalInvestments += quantity;
        productObj.stock -= quantity;
        productObj.sold += quantity;
        eventObj.numInvestments += quantity;

        //Save
        await userObj.save();
        await companyObj.save();
        await productObj.save();
        await eventObj.save();

        //Create Order
        const order = await Order.create({
          company: company,
          user,
          totalPrice,
          quantity,
          event: {
            id: eventObj._id,
            name: eventObj.name,
          },
        });

        res.status(201).json({
          success: true,
          order,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// admin transfer orders
router.delete(
  "/admin-delete-orders/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      const user = await User.findById(order.user._id);
      const company = await Shop.findById(order.company.shopId);
      const productObj = await Product.findById(order.event.id);
      const eventObj = await Event.findOne({ name: order.event.name });
      console.log("event", order.event.name, "product", order.company._id);

      console.log({ productObj, eventObj });

      //Update OBJ vars
      user.accountBalance += order.totalPrice;
      company.balance -= order.totalPrice;
      company.totalInvestments -= order.quantity;
      productObj.stock += order.quantity;
      productObj.sold -= order.quantity;
      eventObj.numInvestments -= order.quantity;

      //Save
      await user.save();
      await company.save();
      await productObj.save();
      await eventObj.save();

      const deleteOrder = await Order.findByIdAndRemove(req.params.id);

      res.status(200).json({
        success: true,
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
        $or: [
          { "user.section": { $in: sectionNames } },
          { "user._id": req.params.id },
        ],
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

// admin transfer orders
router.put(
  "/admin-transfer-orders/:id/:email",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      const order = await Order.findById(req.params.id);
      order.user = user;
      await order.save();
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
