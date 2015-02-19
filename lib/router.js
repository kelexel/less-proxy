var express = require('express');
var router = express.Router();
var config = require('../etc/config.js');

router.post('/proxy', function(req, res, next) {
	var proxy = new (require('../lib/proxy'))(config.templates);
	proxy.run(req, res, next);
});

module.exports = router;
