'use strict'

// Use the express.Router class to create modular, mountable route handlers.
let router = require('express').Router()
let User = require('../models/User.js')
let Diagram = require('../models/diagram.js')

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
      User.findByUsername(request.body.username,
        function (user) {
          if (user !== null) {
            if (user.password === request.body.password) {
              request.session.userId = user.id
              return response.status(200).redirect('/profile')
            } else {
              // NOTE: Password missmatch
              request.session.flash = {
                type: 'login-failed',
                message: 'Invalid username or password'
              }

              return response.status(400).redirect('/login')
            }
          } else {
            // NOTE: No username matching the specified username
            request.session.flash = {
              type: 'login-failed',
              message: 'Invalid username or password'
            }

            return response.status(400).redirect('/login')
          }
        })
    } else {
      request.session.flash = {
        type: 'login-failed',
        message: 'All fields are required.'
      }

      return response.status(400).redirect('/login')
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

      // NOTE: Validation of password containing 6 characters and one number.
      if (!(request.body.password.length >= 6 && /\d+/.test(request.body.password))) {
        request.session.flash = {
          type: 'register-failed-validation',
          message: 'Password must contain atleast 8 characters and one digit.'
        }

        return response.status(400).redirect('/register')
      }

      // Verify that user with username doesn't exist
      User.findByUsername(request.body.username,
        function (user) {
          if (user !== null) {
            User.create(data, function (error, results, fields) {
              if (error) {
                return next(error)
              } else {
                console.log(this.lastID)
                request.session.userId = this.lastID
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
    if (request.session.userId) {
      User.findById(request.session.userId,
        function (username) {
          if (username !== null) {
            let context = { username: username }

            Diagram.findAllUserDiagrams(request.session.userId,
              function (error, rows) {
                if (error) {
                  console.log(error)
                  return next(error)
                }

                context.diagrams = rows.map(function (diagram) {
                  // NOTE: Is an DFA diagram
                  if (diagram.type === null) {
                    return {
                      id: diagram.id,
                      code: diagram.code,
                      title: diagram.title,
                      type: diagram.isNFA ? 'NFA' : 'DFA'
                    }
                  } else {
                    // NOTE: Is a class diagram
                    return {
                      id: diagram.id,
                      code: diagram.code,
                      title: diagram.title,
                      type: diagram.type
                    }
                  }
                })

                Diagram.countUserDiagrams(function (error, rows) {
                  if (error) {
                    console.log(error)
                    return next(error)
                  }

                  let row = null
                  for (let i = 0; i < rows.length; ++i) {
                    if (rows[i].author === request.session.userId) {
                      row = rows[i]
                    }
                  }

                  if (row !== null) {
                    context.totalDiagrams = row.Total
                    context.classDiagrams = row.ClassDiagrams
                    context.dfaDiagrams = row.DFADiagrams - row.NFADiagrams
                    context.nfaDiagrams = row.NFADiagrams
                  }

                  response.render('user/profile', context)
                })
              })
          } else {
            // No user session so this page is forbidden.
            response.status(403).render('error/403')
          }
        })
    } else {
      // No user session so this page is forbidden.
      response.status(403).render('error/403')
    }

    // TODO: Remove this once its translated to sql
    //         Codesnippet.find({ author: request.session.userId })
    //           .exec(function (error, data) {
    //             if (error) {
    //               return next(error)
    //             }

    //             let context = {
    //               codesnippets: data.map(function (codesnippet) {
    //                 return {
    //                   id: codesnippet._id,
    //                   code: codesnippet.code,
    //                   title: codesnippet.title,
    //                   postedAt: codesnippet.postedAt
    //                 }
    //               })
    //             }

    //             context.username = user.username
    //             response.render('user/profile', context)
    //           })
  })

module.exports = router
