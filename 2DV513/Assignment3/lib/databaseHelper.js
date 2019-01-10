'use-strict'

let mongoose = require('mongoose')

function init () {
  let dbConfig = require('../config/database.js')
  let db = mongoose.connection

  // TODO: db.on error
  db.on('error', console.error.bind(console, 'Connection error: '))

  // TODO: db.on open
  db.once('open', function () {
    console.log('Connected to database')
  })

  process.on('SIGINT', function () {
    db.close(function () {
      console.log('Database connection has been terminated.')
      process.exit(0)
    })
  })

  mongoose.connect(dbConfig.connectionString, { useNewUrlParser: true })
}

module.exports.init = init
