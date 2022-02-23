var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render("index", {
    title: "Web-Chat",
    date: (new Date()).toDateString
  })
});

router.get('/test', function (req, res) {
  res.end("test");
});

module.exports = router;
