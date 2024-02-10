const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");
const Section = require("../model/section");
const Event = require("../model/event");
const cloudinary = require("cloudinary");

router.post(
  "/create-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, password, selectedSection, avatar } = req.body;
      const userEmail = await User.findOne({ email });

      //Outlook needed to test security of link, may get flagged as spam

      // if (!email.endsWith("ufl.edu")) {
      //   return next(new ErrorHandler("Email must be a 'ufl.edu' email", 400));
      // }

      let accountBalance = 0;
      const events = await Event.find({
        sections: { $in: [selectedSection] },
      });
      if (events.length > 0) {
        events.forEach((event) => {
          accountBalance += event.numChecks * event.checkPrice;
        });
      }

      if (userEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      const user = {
        name: name,
        email: email,
        password: password,
        section: selectedSection,
        accountBalance: accountBalance,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };

      const activationToken = createActivationToken(user);
      const activationUrl = `http://localhost:3000/activation/${activationToken}`;
      try {
        await sendMail({
          email: user.email,
          subject: "Account Activation",
          message: `Hello ${user.name}, please click the link to activate your account \n${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `please check your email: ${user.email} to activate your account`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message), 400);
    }
  })
);

//creating activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

//activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, section, accountBalance } =
        newUser;

      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const userSection = await Section.findOne({ name: newUser.section });
      userSection.numStudents += 1;

      await userSection.save();

      user = await User.create({
        name,
        email,
        avatar,
        password,
        section,
        accountBalance,
      });

      sendToken(user, 201, res, "token");
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields!", 500));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Incorrect password", 400));
      }
      sendToken(user, 201, res, "token");
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//load user

router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Logout
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
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

//update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, section, name } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Password Incorrect", 400));
      }
      user.name = name;
      user.email = email;
      user.section = section;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user password
router.put(
  `/update-user-password`,
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );
      if (!isPasswordMatched) {
        return next(
          new ErrorHandler("Please enter the correct current password", 500)
        );
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 500));
      }
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//get all admins
router.get(
  "/get-admins",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const admins = await User.find({ role: "admin" });

      res.status(200).json({
        success: true,
        admins,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//add admin
router.put(
  "/add-admin/:email",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.find({ email: req.params.email });

      user[0].role = "admin";
      user[0].section = "Admin";
      user[0].accountBalance = 1000000000;
      await user[0].save();

      res.status(200).json({
        success: true,
        message: "User upgraded to admin successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//remove admin
router.put(
  "/remove-admin/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      user.role = "user";
      user.accountBalance = 0;
      user.section = "Not Assigned";
      await user.save();

      res.status(200).json({
        success: true,
        message: "User downgraded to user successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users/:id",

  catchAsyncErrors(async (req, res, next) => {
    try {
      const adminSections = await Section.find({ "admin.id": req.params.id });

      const sectionNames = adminSections.map((section) => section.name);

      const users = await User.find({ section: { $in: sectionNames } });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",

  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post(
  "/forgot-password/:email",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.find({ email: req.params.email });

      if (!user[0]) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000);

      try {
        await sendMail({
          email: user[0].email,
          subject: "Password Rest",
          message: `Hello ${user[0].name}, please use the following reset code to reset your account password: ${resetCode}`,
        });
        res.status(201).json({
          success: true,
          message: `please check ${user[0].email} for reset code`,
          code: resetCode,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/password-reset/:email/:password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.find({ email: req.params.email });

      if (!user[0]) {
        return next(new ErrorHandler("User does not exist", 400));
      }
      user[0].password = req.params.password;
      await user[0].save();
      res.status(201).json({
        success: true,
        message: `password changed`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
