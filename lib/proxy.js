var express = require('express');
var app = express();

var fs = require('fs');
var prime = require('prime');
var array = require('mout/array');
var path = require('path');
var async = require('async');
var less = require('less');
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
		autoprefixPlugin = new LessPluginAutoPrefix({browsers: ["last 2 versions"]});
var config = require('../etc/config.js');


var Proxy = prime({
	_allowedTemplates: false,
	constructor: function(allowedTemplates) {
		this._allowedTemplates = allowedTemplates;
	},
	run: function(req, res, next) {
		var post = req.body;
		var _file = {
			template: post.template ?  '../templates/'+post.template : false,
			variables: post.variables ? JSON.parse(post.variables) : {},
			destination: post.destination,
			method: post.method ? post.method : 'modifyVars'
		};

		if (post.template) {
			var sequence = [
				this._validateTemplate.bind(this, _file),
				this._loadTemplate.bind(this, _file),
				this._render.bind(this, _file),
				this._store.bind(this, _file),
				this._complete.bind(this, _file, res)
			];
		} else if (post.css) {
			var sequence = [
				this._loadCss.bind(this, _file, post.css),
				this._render.bind(this, _file),
				this._stream.bind(this, _file, res)
			];
		} else {
			console.log('no valid input found')
			return next('Error, no valid input found');
		}

		async.waterfall(sequence, function(err, result){
			if (err) console.log(err);
			next(err);
		});
		return;
	},
	_validateTemplate: function(_file, callback) {
		var found = false;
		if (array.contains(this._allowedTemplates, path.basename(_file.template)))
			callback(null);
		else
			callback('Invalid template '+_file.template);
	},
	_loadTemplate: function(_file, callback) {
		fs.readFile( __dirname + '/'+_file.template, function (err, data) {
			if (err) {
				console.log(err); 
			}
			callback(null, data.toString());
		});
	},
	_loadCss: function(_file, css, callback) {
		callback(null, css);
	},
	_render: function(_file, str, callback) {
		var options = {
 			paths: ['./templates'],  // Specify search paths for @import directives
 			filename: 'style.less', // Specify a filename, for better error messages
 			compress: true,          // Minify CSS output
 			modifyVars: _file.method && _file.method == 'modiftyVars' ? _file.variables : {},
 			globalVars: !_file.method || _file.method == 'globalVars' ? _file.variables : {},
 			plugins: [autoprefixPlugin]
     };
     console.log('options', options)
		less.render(str, options, callback);
	},
	_store: function(_file, output, callback) {
		if (!output.css) throw Error('bad');
		fs.writeFile(config.cacheDir+'/'+_file.destination, output.css, 'utf8', callback);
	},
	_complete: function(_file, res) {
		console.log('Succcess, created '+_file.destination);
		if (app.get('env') === 'development')
			console.log(_file);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({'status': 'success', 'file': _file.destination}, null, 3));
	},
	_stream: function(_file, res, output) {
		console.log('Succcess, streamed '+_file.destination);
		if (app.get('env') === 'development')
			console.log(_file);
		res.setHeader('Content-Type', 'text/css');
		res.end(output.css, null, 3);
	}
})

module.exports = Proxy;
