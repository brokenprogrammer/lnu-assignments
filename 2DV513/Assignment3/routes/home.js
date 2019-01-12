'use strict'

// Use the express.Router class to create modular, mountable route handlers.
let router = require('express').Router()
let User = require('../models/User.js')

// this will trigger on the root url (/)
router.route('/')
  .get(function (request, response, next) {
    // render the view for the home

    if (request.session.userId) {
      response.locals.connection.query(User.findById, request.session.userId,
        function (error, results, fields) {
          if (error) {
            return next(error) // Pass error to express.
          } else {
            let context = { username: results[0].username }
            response.render('home/index', context)
          }
        })
    }

    response.render('home/index')
  })

// Exports
module.exports = router
