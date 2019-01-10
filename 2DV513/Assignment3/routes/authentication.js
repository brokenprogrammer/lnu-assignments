'use strict'

// Use the express.Router class to create modular, mountable route handlers.
let router = require('express').Router()
let User = require('../models/User.js')
let Codesnippet = require('../models/Codesnippet.js')

// csurf module to generate csrf tokens for views.
// According to csurf issues they recommended to move csurf into the routes.
// https://github.com/expressjs/csurf/issues/71#issuecomment-93808764
let csrf = require('csurf')
let csrfProtection = csrf({ cookie: false })

router.route('/login')
  .get(csrfProtection, function (request, response) {
    // If user already authenticated just redirect to profile page.
    if (request.session.userId) {
      // Redirect using status code 303 (See other). I don't know if this is the right HTTP code to use but it seemed to fit this purpose.
      return response.status(303).redirect('/profile')
    }

    // Render view for login page.
    response.render('authentication/login', { csrfToken: request.csrfToken })
  })
  .post(csrfProtection, function (request, response, next) {
    // If user already authenticated just redirect to profile page.
    if (request.session.userId) {
      return response.status(303).redirect('/profile')
    }

    if (request.body.username && request.body.password) {
      User.authenticate(request.body.username, request.body.password,
        function (error, user) {
          if (error) {
            next(error) // Pass error to express.
          }

          // If no user was found or password didn't match.
          if (user === null) {
            request.session.flash = {
              type: 'login-failed',
              message: 'Invalid username or password'
            }

            return response.status(400).redirect('/login')
          } else {
            request.session.userId = user._id
            return response.status(200).redirect('/profile')
          }
        })
    }
  })

router.route('/logout')
  .post(function (request, response, next) {
    if (request.session.userId) {
      delete request.session.userId
      response.status(200).redirect('/')
    } else {
      response.status(303).redirect('/login')
    }
  })

router.route('/register')
  .get(csrfProtection, function (request, response) {
    // If user already authenticated just redirect to profile page.
    if (request.session.userId) {
      return response.status(303).redirect('/profile')
    }

    // Render view for login page.
    response.render('authentication/register', { csrfToken: request.csrfToken })
  })
  .post(csrfProtection, function (request, response, next) {
    // If user already authenticated just redirect to profile page.
    if (request.session.userId) {
      return response.status(303).redirect('/profile')
    }

    if (request.body.password !== request.body.passwordConfirmation) {
      request.session.flash = {
        type: 'register-failed-passwordmissmatch',
        message: 'Password missmatch.'
      }

      return response.status(400).redirect('/register')
    }

    if (request.body.username &&
        request.body.password &&
        request.body.passwordConfirmation) {
      let data = {
        username: request.body.username,
        password: request.body.password
      }

      // Verify that user with username doesn't exist
      User.find({ username: request.body.username }).exec(function (error, user) {
        if (error) {
          return next(error)
        } else {
          if (!user.length) {
            User.create(data, function (error, user) {
              if (error) {
                // If its the password validation error that mongoose throws we handle it manually here.
                if (error.name === 'ValidationError') {
                  request.session.flash = {
                    type: 'register-failed-validation',
                    message: 'Password must contain atleast 8 characters and one digit.'
                  }

                  return response.status(400).redirect('/register')
                } else {
                  return next(error)
                }
              } else {
                request.session.userId = user._id
                return response.status(200).redirect('/profile')
              }
            })
          } else {
            request.session.flash = {
              type: 'register-failed-userexist',
              message: 'Username is already taken.'
            }

            return response.status(400).redirect('/register')
          }
        }
      })
    } else {
      request.session.flash = {
        type: 'register-failed-invalidinput',
        message: 'All fields has to be filled in.'
      }

      return response.status(400).redirect('/register')
    }
  })

router.route('/profile')
  .get(function (request, response, next) {
    User.findById(request.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error)
        } else {
          if (user) {
            Codesnippet.find({ author: request.session.userId })
              .exec(function (error, data) {
                if (error) {
                  return next(error)
                }

                let context = {
                  codesnippets: data.map(function (codesnippet) {
                    return {
                      id: codesnippet._id,
                      code: codesnippet.code,
                      title: codesnippet.title,
                      postedAt: codesnippet.postedAt
                    }
                  })
                }

                context.username = user.username
                response.render('user/profile', context)
              })
          } else {
            // No user session so this page is forbidden.
            response.status(403).render('error/403')
          }
        }
      })
  })

module.exports = router
