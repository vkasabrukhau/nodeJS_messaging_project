const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const logger = require('morgan');
const favicon = require('serve-favicon');
const app = express();
const config = require("./config");
const indexRouter = require('./routes/index');
const expressLayouts = require('express-ejs-layouts');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const MongoStore = require('connect-mongo');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger(config.get("log_format"), { stream: accessLogStream }));

app.use(
  session({
    secret: 'webChat2734',
    store: MongoStore.create({
      mongoUrl: config.get('DB_url')
    })
  })
)

app.use(expressLayouts);
//error handler
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(function (req, res) {
  res.status(404);
  res.render("error")
})

app.use(('/'), indexRouter);
app.use(('/test'), indexRouter)

app.use("/forbidden", function (req, res, next) {
  next(createError(500, "Woops! You can't come here"))
})

app.use(function (err, req, res, next) {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  res.status(err.status || 500)
})

//Setting up nconf
nconf.argv()
  .env()
  .file({ file: 'path/to/config.jason' })


module.exports = app;
