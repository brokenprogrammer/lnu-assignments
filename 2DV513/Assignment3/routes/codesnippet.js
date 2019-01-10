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

router.route('/codesnippet')
  .get(function (request, response, next) {
    Codesnippet.find({})
      .sort('-date')
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

        // If user is authenticated send the username of the user to the view.
        if (request.session.userId) {
          User.getAuthenticatedUser(request.session, (error, user) => {
            if (error) {
              return next(error)
            }

            if (user !== null) {
              context.username = user.username
              response.render('codesnippet/index', context)
            } else {
              // No user matching the session found in database so this page is forbidden.
              response.render('codesnippet/index', context)
            }
          })
        } else {
          response.render('codesnippet/index', context)
        }
      })
  })

router.route('/codesnippet/create')
  .get(csrfProtection, function (request, response, next) {
    let context = { csrfToken: request.csrfToken }

    // If user is authenticated send the username of the user to the view.
    if (request.session.userId) {
      User.getAuthenticatedUser(request.session, (error, user) => {
        if (error) {
          return next(error)
        }

        if (user !== null) {
          context.username = user.username
          response.render('codesnippet/create', context)
        } else {
          // No user matching the session found in database so this page is forbidden.
          response.status(403).render('error/403')
        }
      })
    } else {
      // No user session so this page is forbidden.
      response.status(403).render('error/403')
    }
  })
  .post(csrfProtection, function (request, response, next) {
    if (request.session.userId) {
      if (request.body.code) {
        let snippetTitle = 'Untitled'
        if (request.body.title) {
          snippetTitle = request.body.title
        }

        let data = {
          code: request.body.code,
          title: snippetTitle,
          author: request.session.userId
        }

        Codesnippet.create(data, function (error, snippet) {
          if (error) {
            return next(error)
          } else {
            response.status(200).redirect('/codesnippet')
          }
        })
      }
    } else {
      // No user session so this page is forbidden.
      response.status(403).render('error/403')
    }
  })

router.route('/codesnippet/:id')
  .get(function (request, response, next) {
    if (Codesnippet.isValidId(request.params.id)) {
      Codesnippet.findById(request.params.id)
        .exec(function (error, snippet) {
          if (error) {
            return next(error)
          }

          User.findById(snippet.author)
            .exec(function (error, user) {
              if (error) {
                return next(error)
              }

              let context = {
                single: true,
                id: snippet._id,
                code: snippet.code,
                title: snippet.title,
                postedAt: snippet.postedAt,
                author: user.username
              }

              // If user is authenticated send the username of the user to the view.
              if (request.session.userId) {
                User.getAuthenticatedUser(request.session, (error, user) => {
                  if (error) {
                    return next(error)
                  }

                  if (user !== null) {
                    context.username = user.username
                    response.status(200).render('codesnippet/index', context)
                  } else {
                    // No user matching the session found in database so this page is forbidden.
                    response.status(200).render('codesnippet/index', context)
                  }
                })
              } else {
                response.status(200).render('codesnippet/index', context)
              }
            })
        })
    } else {
      response.status(404).render('error/404')
    }
  })

router.route('/codesnippet/update/:id')
  .get(csrfProtection, function (request, response, next) {
    if (Codesnippet.isValidId(request.params.id)) {
      Codesnippet.findById(request.params.id)
        .exec(function (error, snippet) {
          if (error) {
            return next(error)
          }

          // Snippet author is the same as the authenticated user
          if (snippet.author.equals(request.session.userId)) {
            let context = {
              id: request.params.id,
              title: snippet.title,
              code: snippet.code,
              csrfToken: request.csrfToken
            }

            User.getAuthenticatedUser(request.session, (error, user) => {
              if (error) {
                return next(error)
              }

              if (user !== null) {
                context.username = user.username
                // Render the deletion page.
                response.render('codesnippet/update', context)
              } else {
                // No user matching session found in database so this page is forbidden.
                response.status(403).render('error/403')
              }
            })
          } else {
            // No user session so this page is forbidden.
            response.status(403).render('error/403')
          }
        })
    } else {
      response.status(404).render('error/404')
    }
  })
  .post(csrfProtection, function (request, response, next) {
    if (Codesnippet.isValidId(request.params.id)) {
      if (request.session.userId) {
        Codesnippet.findById(request.params.id)
          .exec(function (error, snippet) {
            if (error) {
              return next(error)
            }

            // Snippet author is the same as the authenticated user
            if (snippet.author.equals(request.session.userId)) {
              Codesnippet.findOneAndUpdate({ _id: request.params.id }, { title: request.body.title, code: request.body.code },
                function (error, doc) {
                  if (error) {
                    return next(error)
                  }

                  request.session.flash = {
                    type: 'update-success',
                    message: 'The snippet was successfully updated.'
                  }

                  // Snippet was deleted, now redirects to snippet's view.
                  response.status(200).redirect('/codesnippet/' + request.params.id)
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
    } else {
      response.status(404).render('error/404')
    }
  })

router.route('/codesnippet/delete/:id')
  .get(csrfProtection, function (request, response, next) {
    if (Codesnippet.isValidId(request.params.id)) {
      Codesnippet.findById(request.params.id)
        .exec(function (error, snippet) {
          if (error) {
            return next(error)
          }

          // Snippet author is the same as the authenticated user
          if (snippet.author.equals(request.session.userId)) {
            let context = {
              id: request.params.id,
              title: snippet.title,
              csrfToken: request.csrfToken
            }

            User.getAuthenticatedUser(request.session, (error, user) => {
              if (error) {
                return next(error)
              }

              if (user !== null) {
                context.username = user.username
                // Render the deletion page.
                response.render('codesnippet/delete', context)
              } else {
                // No user matching session found in database so this page is forbidden.
                response.status(403).render('error/403')
              }
            })
          } else {
            // No user session so this page is forbidden.
            response.status(403).render('error/403')
          }
        })
    } else {
      response.status(404).render('error/404')
    }
  })
  .post(csrfProtection, function (request, response, next) {
    if (request.session.userId && (request.params.id === request.body.id)) {
      Codesnippet.findById(request.body.id)
        .exec(function (error, snippet) {
          if (error) {
            return next(error)
          }

          // Snippet author is the same as the authenticated user
          if (snippet.author.equals(request.session.userId)) {
            Codesnippet.findOneAndDelete({ _id: request.body.id }, function (error) {
              if (error) {
                return next(error)
              }

              request.session.flash = {
                type: 'delete-success',
                message: 'The snippet was successfully deleted.'
              }

              // Snippet was deleted, now redirects to the users profile page.
              response.status(200).redirect('/profile')
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
  })

module.exports = router
