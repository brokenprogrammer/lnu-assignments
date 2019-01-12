'use strict'

let router = require('express').Router()
let User = require('../models/User.js')
let Diagram = require('../models/diagram.js')

// csurf module to generate csrf tokens for views.
// According to csurf issues they recommended to move csurf into the routes.
// https://github.com/expressjs/csurf/issues/71#issuecomment-93808764
let csrf = require('csurf')
let csrfProtection = csrf({ cookie: false })

router.route('/diagram')
  .get(function (request, response, next) {
    Diagram.findAll(function (error, rows) {
      if (error) {
        console.log(error)
        return next(error)
      }

      let context = {
        diagrams: rows.map(function (diagram) {
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
      }

      if (request.session.userId) {
        User.findById(request.session.userId,
          function (username) {
            if (username !== null) {
              context.username = username
              response.render('diagram/index', context)
            }
          })
      } else {
        response.render('diagram/index', context)
      }
    })
  })

router.route('/diagram/create')
  .get(csrfProtection, function (request, response, next) {
    let context = { csrfToken: request.csrfToken }
    // If user is authenticated send the username of the user to the view.
    if (request.session.userId) {
      User.findById(request.session.userId,
        function (username) {
          if (username !== null) {
            context.username = username
            response.render('diagram/create', context)
          } else {
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
        let diagramTitle = 'Untitled'

        if (request.body.title) {
          diagramTitle = request.body.title
        }

        let diagramType = ''
        let diagramisNFA = false
        if (request.body.code.includes('<dfa>')) {
          diagramType = 'dfa'
        } else if (request.body.code.includes('<nfa>')) {
          diagramType = 'dfa'
          diagramisNFA = true
        } else if (request.body.code.includes('<class>')) {
          diagramType = 'class'
        }

        let data = {
          code: request.body.code,
          title: diagramTitle,
          author: request.session.userId,
          type: diagramType,
          isNFA: diagramisNFA,
          classType: 'Class'
        }

        Diagram.create(data, function (error) {
          if (error) {
            return next(error)
          } else {
            response.status(200).redirect('/diagram')
          }
        })
      }
    } else {
      // No user session so this page is forbidden.
      response.status(403).render('error/403')
    }
  })

module.exports = router
