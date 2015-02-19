var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({'hello': 'world'}, null, 3));
});

module.exports = router;
