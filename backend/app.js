const express = require("express");
const ErrorHandler = require("./middleware/error.js");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");

app.use(
  express.json({
    limit: "100mb",
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/couponCode");
const section = require("./controller/section");
const order = require("./controller/order");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/order", order);
app.use("/api/v2/section", section);

// serve static client files in production
if (process.env.NODE_ENV === 'production') {
  // FIXME: should probably be env vars within cloud host
  require("dotenv").config({
    path: "backend/config/.env",
  });

  app.use(express.static(path.join(__dirname, './../frontend/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './../frontend/build/index.html'))
  })
}

app.use(ErrorHandler);
module.exports = app;
