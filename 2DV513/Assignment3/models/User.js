'use strict'

let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredAt: { type: Date, required: true, default: Date.now }
})

userSchema.path('password').validate(function (password) {
  return password.length >= 6 && /\d+/.test(password)
}, 'The password must be of minimum 8 characters containing atleast 1 number.')

userSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (error, user) {
      if (error) {
        return callback(error)
      } else if (!user) {
        return callback(null, null)
      }

      bcrypt.compare(password, user.password, function (error, result) {
        if (error) {
          return callback(error)
        }

        if (result === true) {
          return callback(null, user)
        } else {
          return callback(null, null)
        }
      })
    })
}

// Use bcrypt to hash passwords before its saved within the database
userSchema.pre('save', function (next) {
  let user = this
  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) {
      return next(error)
    }
    user.password = hash
    next()
  })
})

userSchema.statics.getAuthenticatedUser = function (session, callback) {
  if (session.userId) {
    User.findById(session.userId)
      .exec(function (error, user) {
        if (error) {
          return callback(error, null)
        }

        return callback(null, user)
      })
  } else {
    // No user is currently logged in.
    return callback(null, null)
  }
}

let User = mongoose.model('User', userSchema)
module.exports = User
