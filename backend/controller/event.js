const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/user");
const Shop = require("../model/shop");
const Event = require("../model/event");
const Product = require("../model/product");

const { isSeller } = require("../middleware/auth");
const fs = require("fs");
const axios = require("axios");

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
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);

        const eventData = req.body;
        eventData.images = imageUrls;
        const event = await Event.create(eventData);
        //create product
        await axios.post(
          `http://localhost:8000/api/v2/event/create-event-products/${event._id}`,
          eventData
        );

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

router.post(
  "/create-event-products/:id",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      //For each section
      sections = req.body.sections.slice(1);
      sections.forEach(async (i) => {
        //Get users within section
        const users = await User.find({ section: i });
        //Update account balances
        users.forEach(async (user) => {
          const userObj = await User.findById(user._id);
          userObj.accountBalance = req.body.numChecks * req.body.checkPrice;
          userObj.save();
        });
        //Get companies in section
        const companies = await Shop.find({ section: i });

        companies.forEach(async (company) => {
          const companyObj = await Shop.findById(company._id);
          //Create product using company + event info
          const config = { headers: { "Content-Type": "multipart/form-data" } };
          const newForm = new FormData();
          //images

          let files = [companyObj.avatar, ...req.body.images];

          // Remove new line characters and trim each file name
          const sanitizedFiles = files.map((file) => file.trim());

          //form
          sanitizedFiles.forEach((image) => {
            newForm.append("images", image);
          });
          newForm.append("eventId", req.params.id);
          newForm.append("name", companyObj.name + " - " + req.body.name);
          newForm.append("description", companyObj.description);
          newForm.append("section", companyObj.section);
          newForm.append("price", req.body.checkPrice);

          //determine stock
          let stock = 0;
          let maxRound = req.body.maxInvestmentsRound;
          let maxCompany = req.body.maxInvestmentsCompany;
          let companyInvestments = companyObj.totalInvestments;
          if (maxCompany - companyInvestments > maxRound) {
            stock = maxRound;
          } else {
            stock = maxCompany - companyInvestments;
          }

          newForm.append("stock", stock);
          newForm.append("eventID", req.body.name);
          newForm.append("shopId", companyObj._id);
          newForm.append("shop", companyObj);
          newForm.append("start_Date", req.body.start_Date);
          newForm.append("finish_Date", req.body.finish_Date);

          await axios
            .post(
              `http://localhost:8000/api/v2/product/create-product`,
              newForm,
              config
            )
            .catch((err) => console.log(err));
        });
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

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
      const eventData = await Event.findById(req.params.id);

      // eventData.images.forEach((imageUrl) => {
      //   const filename = imageUrl;
      //   const filePath = `uploads/${filename}`;
      //   try {
      //     fs.unlink(filePath, (err) => {
      //       if (err) {
      //         console.log(err);
      //       }
      //     });
      //   } catch (error) {}
      // });

      const products = await Product.find({
        eventId: req.params.id,
      });
      console.log(products);
      if (products) {
        products.forEach(async (product) => {
          await axios
            .delete(`/delete-shop-product/${product.shop.email}`)
            .catch((err) => console.log(err));
        });
      }

      // const event = await Event.findByIdAndDelete(eventId);

      // if (!event) {
      //   return next(new ErrorHandler("Event not found", 500));
      // }

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

module.exports = router;
