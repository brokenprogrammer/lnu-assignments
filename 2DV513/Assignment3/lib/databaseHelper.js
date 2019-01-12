'use-strict'

let mysql = require('mysql')

function databaseMiddleware (req, res, next) {
  let dbConfig = require('../config/database.js')
  res.locals.connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    multipleStatements: true
  })

  res.locals.connection.connect()

  // Create User table if it doesn't exist.
  res.locals.connection.query(require('../models/User.js').userTable, function (error, results, fields) {
    if (error) {
      console.log(error.message)
    }
  })

  // Create Diagrams table if it doesn't exist.
  res.locals.connection.query(require('../models/diagram.js').diagramTable, function (error, results, fields) {
    if (error) {
      console.log(error.message)
    }
  })

  // Create ClassDiagrams table if it doesn't exist.
  res.locals.connection.query(require('../models/diagram.js').classDiagramTable, function (error, results, fields) {
    if (error) {
      console.log(error.message)
    }
  })

  // Create DFADiagrams table if it doesn't exist.
  res.locals.connection.query(require('../models/diagram.js').dfaDiagramTable, function (error, results, fields) {
    if (error) {
      console.log(error.message)
    }
  })

  // let data = {
  //   type: 'dfa',
  //   title: 'MyDFA',
  //   code: 'asduashda',
  //   author: 1,
  //   isNFA: true
  // }
  // require('../models/diagram.js').create(res.locals.connection, data, function (error, results, fields) {
  //   if (error) {
  //     console.log(error.message)
  //   }
  // })

  next()
}

module.exports.databaseMiddleware = databaseMiddleware
