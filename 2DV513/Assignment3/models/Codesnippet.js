'use strict'

let mongoose = require('mongoose')

let codesnippetSchema = mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true, default: 'Untitled' },
  postedAt: { type: Date, required: true, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

codesnippetSchema.statics.isValidId = function (id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return true
  } else {
    return false
  }
}

let Codesnippet = mongoose.model('Codesnippet', codesnippetSchema)
module.exports = Codesnippet
