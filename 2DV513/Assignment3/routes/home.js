'use strict'

// Use the express.Router class to create modular, mountable route handlers.
let router = require('express').Router()
let User = require('../models/User.js')

// this will trigger on the root url (/)
router.route('/')
  .get(function (request, response, next) {
    // render the view for the home
    if (request.session.userId) {
      let username = User.findById(request.session.userId)
      if (username !== null) {
        let context = { username: username }
        response.render('home/index', context)
      } else {
        response.render('home/index')
      }
    }
    response.render('home/index')
  })

// Exports
module.exports = router
