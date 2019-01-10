'use strict'

let register = function (Handlebars) {
  let helpers = {
    ifEqual: function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this)
      }
      return options.inverse(this)
    }
  }

  if (Handlebars && typeof Handlebars.registerHelper === 'function') {
    for (let helper in helpers) {
      Handlebars.registerHelper(helper, helpers[helper])
    }
  } else {
    return helpers
  }
}

module.exports.register = register
module.exports.helpers = register(null)
