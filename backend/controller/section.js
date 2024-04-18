const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Section = require("../model/section");
const Order = require("../model/order");
const Shop = require("../model/shop");
const User = require("../model/user");

router.post(
  "/create-section/:name/:id/:adminName",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const section = await Section.find({ name: req.params.name });
      if (section[0]) {
        return next(new ErrorHandler("Section already exists", 400));
      }
      const newSection = await Section.create({
        name: req.params.name,
        admin: { id: req.params.id, name: req.params.adminName },
      });
      res.status(200).json({
        success: true,
        newSection,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.post(
  "/remove-section/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sectionData = await Section.find({ name: req.params.name });

      if (!sectionData[0]) {
        return next(new ErrorHandler("Section does not exist", 400));
      }

      const orders = await Order.find({ "user.section": req.params.name });
      const users = await User.find({ section: req.params.name });
      const companies = await Shop.find({ section: req.params.name });

      for (const order of orders) {
        await Order.findByIdAndDelete(order._id);
      }

      // Find all users associated with the section and delete them
      for (const user of users) {
        await User.findByIdAndDelete(user._id);
      }

      // Find all companies associated with the section and delete them
      for (const company of companies) {
        await Shop.findByIdAndDelete(company._id);
      }

      const sectionId = sectionData[0]._id;
      const section = await Section.findByIdAndDelete(sectionId);
      res.status(201).json({
        success: true,
        message: "section deleted",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/get-section/:section",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const section = await Section.find({ name: req.params.section });

      if (!section) {
        return next(new ErrorHandler("Section does not exist", 400));
      }

      res.status(201).json({
        success: true,
        section,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//get all sections
router.get(
  "/get-sections",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sections = await Section.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sections,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//get section for specific admin
router.get(
  "/get-sections/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sections = await Section.find({ "admin.id": req.params.id });
      res.status(201).json({
        success: true,
        sections,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
