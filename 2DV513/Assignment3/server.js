'use strict'

let express = require('express')
let bodyParser = require('body-parser')
let exphbs = require('express-handlebars')
let path = require('path')
let session = require('express-session')
let helmet = require('helmet')

let app = express()
let port = process.env.PORT || 8000

// Initialize Database.
require('./lib/databaseHelper.js').init()

// Set view engine.
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./lib/handlebarsHelpers.js').helpers
}))
app.set('view engine', '.hbs')

// Support for application/json and HTML form data.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Set up express-session
app.use(session({
  name: 'codesnippetapplication',
  secret: 'K7smsx9MsEasad89wEzVp5EeCep5s',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

// Support for Flash messages / render message
app.use(function (request, response, next) {
  if (request.session.flash) {
    response.locals.flash = request.session.flash

    delete request.session.flash
  }

  next()
})

// Set express to look in folder "public" to static resources
app.use(express.static(path.join(__dirname, 'public'), { index: false }))

// Load routes
app.use('/', require('./routes/home.js'))
app.use('/', require('./routes/authentication.js'))
app.use('/', require('./routes/codesnippet.js'))

// Set content security policy using helmet
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'stackpath.bootstrapcdn.com', 'use.fontawesome.com', 'cdnjs.cloudflare.com'],
    scriptSrc: ["'self'", 'code.jquery.com', 'cdnjs.cloudflare.com', 'stackpath.bootstrapcdn.com', "'unsafe-inline'"],
    imgSrc: ["'self'", 'use.fontawesome.com'],
    fontSrc: ["'self'", 'use.fontawesome.com'],
    workerSrc: false
  },
  browserSniff: false,
  setAllHeaders: true
}))

// Error handling

// Page not found.
app.use(function (request, response, next) {
  response.status(404).render('error/404')
})

// Internal server error.
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('500/Internal server error.')
})

// Launching the application
app.listen(port, function () {
  console.log('Express app listening on port %s!', port)
})
