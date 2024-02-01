const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/shopToken");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler.js");
const User = require("../model/user");
const Section = require("../model/section");

router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      section: req.body.section,
    };

    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Shop Account Activation",
        message: `Hello ${seller.name}, please click the link to activate your shop account \n${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email: ${seller.email} to activate your shop account`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//creating activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "55m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, section } = newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        section,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login to shop

router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields!", 500));
      }
      const seller = await Shop.findOne({ email }).select("+password");
      if (!seller) {
        return next(new ErrorHandler("Shop does not exist", 400));
      }
      const isPasswordValid = await seller.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Incorrect password", 400));
      }
      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//load shop

router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);
      if (!seller) {
        return next(new ErrorHandler("Seller does not exist", 400));
      }
      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Logout
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// add user to shop
router.get(
  "/shop-add-member/:id/:email",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      const user = await User.find({ email: req.params.email });
      const userEmail = user[0].email;
      let userAlreadyMember = false;

      if (!user) {
        //not returning
        res.status(400).json({
          success: false,
          message: "User does not exist",
        });
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      if (!shop) {
        return next(new ErrorHandler("Shop doesn't exist", 400));
      }

      for (let i = 0; i < shop.teamMembers.length; i++) {
        if (shop.teamMembers[i].email === userEmail) {
          userAlreadyMember = true;
        }
      }

      if (userAlreadyMember === false) {
        user[0].companyId = req.params.id;
        shop.teamMembers.push(user[0]);
      } else {
        res.status(400).json({
          success: false,
          message: "User is already a member",
        });
        return next(new ErrorHandler("User is already a member", 401));
      }

      await shop.save();
      await user[0].save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// remove member of shop
router.get(
  "/shop-remove-member/:id/:shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      const shop = await Shop.findById(req.params.shop);

      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      if (!shop) {
        return next(new ErrorHandler("Shop doesn't exist", 400));
      }

      user.companyId = "Not Assigned";
      user.companyRole = "Not Assigned";
      user.companyInvestment = 0;

      const index = shop.teamMembers.findIndex(
        (member) => member._id.toString() === req.params.id
      );
      shop.teamMembers.splice(index, 1);

      await user.save();
      await shop.save();

      res.status(200).json({
        success: true,
        message: "Successfully removed user",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// modify member
router.put(
  "/shop-update-member/:id/:role/:ownership/:shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }

      user.companyRole = req.params.role;
      user.companyInvestment = req.params.ownership;

      const shop = await Shop.findById(req.params.shop);
      const index = shop.teamMembers.findIndex(
        (member) => member._id.toString() === req.params.id
      );
      shop.teamMembers.splice(index, 1);

      shop.teamMembers.push(user);

      await user.save();
      await shop.save();

      res.status(200).json({
        success: true,
        message: "Successfully updated user",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, valuation, finalAq } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.valuation = valuation;
      shop.finalAcquisition = finalAq;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//getting all members of a shop
router.get(
  "/get-all-members-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const members = await User.find({ companyId: req.params.id });
      res.status(200).json({
        success: true,
        members,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers/:id",

  catchAsyncErrors(async (req, res, next) => {
    try {
      const adminSections = await Section.find({ "admin.id": req.params.id });
      const sectionNames = adminSections.map((section) => section.name);

      const sellers = await Shop.find({ section: { $in: sectionNames } });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",

  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Company deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
