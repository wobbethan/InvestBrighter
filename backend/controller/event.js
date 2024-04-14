const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/user");
const Shop = require("../model/shop");
const Event = require("../model/event");
const Product = require("../model/product");
const cloudinary = require("cloudinary");

const { isSeller } = require("../middleware/auth");
const fs = require("fs");
const axios = require("axios");
const baseRoute =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";

//create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userID = req.body.adminId;
      const user = await User.findById(userID);
      if (user.role !== "admin") {
        return next(new ErrorHandler("User is not an admin", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const eventData = req.body;
        eventData.images = imagesLinks;
        const event = await Event.create(eventData);

        //create product
        createEventProducts(event._id, eventData);

        const admins = await User.find({ role: "admin" });
        admins.forEach(async (admin) => {
          admin.accountBalance = 1000000000;
          await admin.save();
        });

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//Creating all products within round and giving balance to users

const createEventProducts = async (id, eventData) => {
  try {
    //For each section
    sections = eventData.sections.slice(1);
    sections.forEach(async (i) => {
      //Get users within section
      const users = await User.find({ section: i });
      //Update account balances
      users.forEach(async (user) => {
        const userObj = await User.findById(user._id);
        //Sets account balance, two rounds at the same time will not have an accurate account balance
        userObj.accountBalance = eventData.numChecks * eventData.checkPrice;
        userObj.save();
      });
      //Get companies in section
      const companies = await Shop.find({ section: i });

      companies.forEach(async (company) => {
        const companyObj = await Shop.findById(company._id);

        //determine stock
        let stock = 0;
        let maxRound = eventData.maxInvestmentsRound;
        let maxCompany = eventData.maxInvestmentsCompany;
        let companyInvestments = companyObj.totalInvestments;
        if (maxCompany - companyInvestments > maxRound) {
          stock = maxRound;
        } else {
          stock = maxCompany - companyInvestments;
        }

        const product = {
          images: companyObj.avatar,
          eventId: id,
          name: companyObj.name + " - " + eventData.name,
          description: companyObj.description,
          section: companyObj.section,
          price: eventData.checkPrice,
          stock: stock,
          eventName: eventData.name,
          shopId: companyObj._id,
          shop: companyObj,
          start_Date: eventData.start_Date,
          finish_Date: eventData.finish_Date,
        };

        const newProduct = await Product.create(product);
      });
    });
  } catch (error) {
    console.log("Error in createEventProducts");
    return;
  }
};

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events section
router.get(
  "/get-all-events-section/:section",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({
        sections: { $in: [req.params.section] },
      });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//Getting all events of shop
router.get(
  "/get-all-events-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//delete event

router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);

      if (!event) {
        return next(new ErrorHandler("Event not found", 500));
      }

      try {
        const products = await Product.find({
          eventId: req.params.id,
        });

        products.forEach(async (product) => {
          const deleteProduct = await Product.findByIdAndDelete(product._id);
        });
      } catch (error) {
        return next(new ErrorHandler(error, 501));
      }

      try {
        for (let i = 0; i < event.images.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(
            event.images[i].public_id
          );
        }
      } catch (error) {
        console.log(error);
      }

      res.status(201).json({
        success: true,
        message: "Event successfully deleted!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all events by admin
router.get(
  "/admin-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ adminId: req.params.id });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// lock event
router.put(
  "/lock-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      event.status = "Locked";
      await event.save();
      res.status(201).json({
        success: true,
        message: "Round locked",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// unlock event
router.put(
  "/unlock-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      event.status = "Running";
      await event.save();
      res.status(201).json({
        success: true,
        message: "Round unlocked",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get event status
router.get(
  "/event-status/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      const status = event.status;
      res.status(201).json({
        success: true,
        data: status,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/get-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/update-event/:id",
  upload.none(),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      const oldBalance = event.numChecks * event.checkPrice;
      const newBalance = req.body.numChecks * req.body.checkPrice;
      const difference = newBalance - oldBalance;

      event.name = req.body.name;
      event.description = req.body.description;
      event.numChecks = req.body.numChecks;
      event.checkPrice = req.body.checkPrice;
      event.maxInvestmentsCompany = req.body.maxInvestmentsCompany;
      event.maxInvestmentsRound = req.body.maxInvestmentsRound;

      if (req.body.start_Date == null) {
        event.start_Date = "undefined";
        event.finish_Date = "undefined";
      } else {
        event.start_Date = req.body.start_Date;
        event.finish_Date = req.body.finish_Date;
      }

      updateUserBalance;

      await event.save();

      res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

const updateUserBalance = async (id, difference, section) => {
  console.log(id);
};

module.exports = router;
