const express = require('express')
const router = express.Router()
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const { upload } = require('../multer')
const ErrorHandler = require('../utils/ErrorHandler')
const User = require('../model/user')
const Shop = require('../model/shop')
const Event = require('../model/event')
const Product = require('../model/product')
const cloudinary = require('cloudinary')

const { isSeller } = require('../middleware/auth')
const fs = require('fs')
const axios = require('axios')
const baseRoute =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'

//create event
router.post(
  '/create-event',
  upload.array('images'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userID = req.body.adminId
      const user = await User.findById(userID)
      if (user.role !== 'admin') {
        return next(new ErrorHandler('User is not an admin', 400))
      } else {
        let images = []

        if (typeof req.body.images === 'string') {
          images.push(req.body.images)
        } else {
          images = req.body.images
        }

        const imagesLinks = []

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
          })

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
          })
        }

        const eventData = req.body
        eventData.images = imagesLinks
        const event = await Event.create(eventData)

        //create product
        await axios.post(
          `${baseRoute}/api/v2/event/create-event-products/${event._id}`,
          eventData
        )

        res.status(201).json({
          success: true,
          event
        })
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  })
)

//Creating all products within round and giving balance to users

router.post(
  '/create-event-products/:id',
  upload.array('images'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      //For each section
      sections = req.body.sections.slice(1)
      sections.forEach(async (i) => {
        //Get users within section
        const users = await User.find({ section: i })
        //Update account balances
        users.forEach(async (user) => {
          const userObj = await User.findById(user._id)
          //Sets account balance, two rounds at the same time will not have an accurate account balance
          userObj.accountBalance = req.body.numChecks * req.body.checkPrice
          userObj.save()
        })
        //Get companies in section
        const companies = await Shop.find({ section: i })

        companies.forEach(async (company) => {
          const companyObj = await Shop.findById(company._id)

          //Create product using company + event info
          const config = { headers: { 'Content-Type': 'multipart/form-data' } }
          const newForm = new FormData()

          //form
          newForm.append('images', companyObj.avatar)
          newForm.append('eventId', req.params.id)
          newForm.append('name', companyObj.name + ' - ' + req.body.name)
          newForm.append('description', companyObj.description)
          newForm.append('section', companyObj.section)
          newForm.append('price', req.body.checkPrice)

          //determine stock
          let stock = 0
          let maxRound = req.body.maxInvestmentsRound
          let maxCompany = req.body.maxInvestmentsCompany
          let companyInvestments = companyObj.totalInvestments
          if (maxCompany - companyInvestments > maxRound) {
            stock = maxRound
          } else {
            stock = maxCompany - companyInvestments
          }

          newForm.append('stock', stock)
          newForm.append('eventID', req.body.name)
          newForm.append('shopId', companyObj._id)
          newForm.append('shop', companyObj)
          newForm.append('start_Date', req.body.start_Date)
          newForm.append('finish_Date', req.body.finish_Date)

          await axios
            .post(
              `${baseRoute}/api/v2/product/create-product`,
              newForm,
              config
            )
            .catch((err) => console.log(err))
        })
      })
    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  })
)

// get all events
router.get('/get-all-events', async (req, res, next) => {
  try {
    const events = await Event.find()
    res.status(201).json({
      success: true,
      events
    })
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
})

// get all events section
router.get(
  '/get-all-events-section/:section',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({
        sections: { $in: [req.params.section] }
      })

      res.status(201).json({
        success: true,
        events
      })
    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  })
)

//Getting all events of shop
router.get(
  '/get-all-events-shop/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id })
      res.status(201).json({
        success: true,
        events
      })
    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  })
)

//delete event

router.delete(
  '/delete-shop-event/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id)

      if (!event) {
        return next(new ErrorHandler('Event not found', 500))
      }

      await axios
        .delete(
          `${baseRoute}/api/v2/product/delete-company-products/${req.params.id}`
        )
        .catch((err) => console.log(err))

      try {
        for (let i = 0; 0 < event.images.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(
            event.images[i].public_id
          )
        }
      } catch (error) {
        console.log(error)
      }

      res.status(201).json({
        success: true,
        message: 'Event successfully deleted!'
      })
    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  })
)

// all events by admin
router.get(
  '/admin-all-events/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ adminId: req.params.id })
      res.status(201).json({
        success: true,
        events
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  })
)

// lock event
router.put(
  '/lock-shop-event/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id)
      event.status = 'Locked'
      await event.save()
      res.status(201).json({
        success: true,
        message: 'Round locked'
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  })
)

// unlock event
router.put(
  '/unlock-shop-event/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id)
      event.status = 'Running'
      await event.save()
      res.status(201).json({
        success: true,
        message: 'Round unlocked'
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  })
)

// get event status
router.get(
  '/event-status/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id)
      const status = event.status
      res.status(201).json({
        success: true,
        data: status
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  })
)

module.exports = router
