'use strict'

// let bcrypt = require('bcrypt')
let db = require('../lib/databaseHelper').db

let userTable = 'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username varchar(100) not null, password varchar(100) not null, registeredat timestamp default current_timestamp)'

// let findById = 'SELECT * FROM Users WHERE `id`=?'
// let findByUsername = 'SELECT * FROM Users WHERE `username`=?'

function findByUsername (username, callback) {
  let sql = 'SELECT * FROM Users WHERE `username`=?'
  db.get(sql, username, function (error, result) {
    if (error) {
      console.log(error)
      return callback(null)
    }
    return callback(result)
  })
}

function findById (id, callback) {
  let sql = 'SELECT * FROM Users WHERE `id`=?'
  db.get(sql, id, function (error, result) {
    if (error) {
      return callback(null)
    }

    return callback(result.username)
  })
}

// TODO: Encryption?
function create (data, callback) {
  let queryString = 'INSERT INTO Users(username, password) VALUES(?, ?)'
  db.run(queryString, [data.username, data.password], callback)
}

module.exports.userTable = userTable
module.exports.findById = findById
module.exports.findByUsername = findByUsername
module.exports.create = create

// TODO: Remove this once its implementation has been translated to sql
// let userSchema = mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   registeredAt: { type: Date, required: true, default: Date.now }
// })

// userSchema.path('password').validate(function (password) {
//   return password.length >= 6 && /\d+/.test(password)
// }, 'The password must be of minimum 8 characters containing atleast 1 number.')

// userSchema.statics.authenticate = function (username, password, callback) {
//   User.findOne({ username: username })
//     .exec(function (error, user) {
//       if (error) {
//         return callback(error)
//       } else if (!user) {
//         return callback(null, null)
//       }

//       bcrypt.compare(password, user.password, function (error, result) {
//         if (error) {
//           return callback(error)
//         }

//         if (result === true) {
//           return callback(null, user)
//         } else {
//           return callback(null, null)
//         }
//       })
//     })
// }

// // Use bcrypt to hash passwords before its saved within the database
// userSchema.pre('save', function (next) {
//   let user = this
//   bcrypt.hash(user.password, 10, function (error, hash) {
//     if (error) {
//       return next(error)
//     }
//     user.password = hash
//     next()
//   })
// })

// userSchema.statics.getAuthenticatedUser = function (session, callback) {
//   if (session.userId) {
//     User.findById(session.userId)
//       .exec(function (error, user) {
//         if (error) {
//           return callback(error, null)
//         }

//         return callback(null, user)
//       })
//   } else {
//     // No user is currently logged in.
//     return callback(null, null)
//   }
// }
