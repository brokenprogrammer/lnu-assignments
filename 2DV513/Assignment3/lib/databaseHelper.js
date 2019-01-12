'use-strict'

// let mysql = require('mysql')
let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./db/sampleDB.db')

function init () {
  db.run(require('../models/User.js').userTable)
  db.run(require('../models/diagram.js').diagramTable)
  db.run(require('../models/diagram.js').classDiagramTable)
  db.run(require('../models/diagram.js').dfaDiagramTable)

  process.on('SIGINT', function () {
    console.log('Closing sqlite3 database connection.')
    db.close()
    process.exit(0)
  })
}

// // TODO: Change from being middleware into init function then connect and end between
// // every query.
// function databaseMiddleware (req, res, next) {
//   let dbConfig = require('../config/database.js')
//   res.locals.connection = mysql.createPool({
//     host: dbConfig.host,
//     user: dbConfig.user,
//     password: dbConfig.password,
//     database: dbConfig.database,
//     multipleStatements: true
//   })

//   db.run(require('../models/User.js').userTable)
//   db.run(require('../models/diagram.js').diagramTable)
//   db.run(require('../models/diagram.js').classDiagramTable)
//   db.run(require('../models/diagram.js').dfaDiagramTable)

//   res.locals.connection.getConnection(function (error, connection) {
//     if (error) {
//       console.log(error)
//     }

//     // Create User table if it doesn't exist.
//     connection.query(require('../models/User.js').userTable, function (error, results, fields) {
//       if (error) {
//         console.log(error.message)
//       }
//     })

//     // Create Diagrams table if it doesn't exist.
//     connection.query(require('../models/diagram.js').diagramTable, function (error, results, fields) {
//       if (error) {
//         console.log(error.message)
//       }
//     })

//     // Create ClassDiagrams table if it doesn't exist.
//     connection.query(require('../models/diagram.js').classDiagramTable, function (error, results, fields) {
//       if (error) {
//         console.log(error.message)
//       }
//     })

//     // Create DFADiagrams table if it doesn't exist.
//     connection.query(require('../models/diagram.js').dfaDiagramTable, function (error, results, fields) {
//       if (error) {
//         console.log(error.message)
//       }
//     })

//     // Putting connection back in the pool when done.
//     connection.release()
//   })

//   // let data = {
//   //   type: 'dfa',
//   //   title: 'MyDFA',
//   //   code: 'asduashda',
//   //   author: 1,
//   //   isNFA: true
//   // }
//   // require('../models/diagram.js').create(res.locals.connection, data, function (error, results, fields) {
//   //   if (error) {
//   //     console.log(error.message)
//   //   }
//   // })

//   next()
// }

module.exports.init = init
module.exports.db = db
