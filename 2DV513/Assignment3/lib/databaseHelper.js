'use-strict'

let mysql = require('mysql')

function databaseMiddleware (req, res, next) {
  let dbConfig = require('../config/database.js')
  res.locals.connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  })

  res.locals.connection.connect()

  // Create User table if it doesn't exist.
  res.locals.connection.query(require('../models/User.js').userTable, function (error, results, fields) {
    if (error) {
      console.log(error.message)
    }
  })

  next()
}

module.exports.databaseMiddleware = databaseMiddleware
