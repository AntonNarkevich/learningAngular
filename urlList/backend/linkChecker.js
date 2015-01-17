var http = require('http');
var request = require('request');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
	console.log('Setting headers');
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	return next();
});

app.post('/', function(req, res){
	var targetUrl = req.body.url;

	request({
		method: 'HEAD',
		uri: targetUrl
	}, function (err) {
		console.log(err);

		var status = err ? 'err' : 'ok';



		res.json({
			url: targetUrl,
			status: status
		});
	});
});

app.listen(3000, function() {
	console.log('Started listening on 3000');
});