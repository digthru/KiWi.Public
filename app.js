// -----------------------------------------------------------------------------
// App.js
// -----------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var less = require('less');
var port = process.env.PORT || 80;

function compileLess(file, to, callback) {
	fs.readFile(file, "utf8", function(err, data) {
		if (err) {
			return console.error(err);
		}
		less.render(data, function(err, css) {
			if (err) {
				return console.error(err);
			}
			fs.writeFile(to, css, function(err) {
				if (err) {
					return console.error(err);
				}

				callback();
			});
		});
	});
}

compileLess('./less-stylesheets/prototype.typography.less', './public/stylesheets/prototype.typography.css', function() {
	compileLess('./less-stylesheets/prototype.reset.less', './public/stylesheets/prototype.reset.css', function() {
		compileLess('./less-stylesheets/prototype.less', './public/stylesheets/prototype.css', function() {
			var app = express();

			app.set('port', port);
			app.set('views', 'views');
			app.set('view engine', 'jade');

			app.use(express.favicon());
			app.use(express.bodyParser());
			app.use(express.methodOverride());

			app.use('/', express.static(path.join(__dirname, 'public'), {
				maxAge: 3456000000
			}));

			app.configure('development', function() {
				app.use(express.errorHandler());
			});

			app.get('/', function(req, res) {
				res.render('base');
			});

			app.post("/subscribe", function(req, res) {
				if (req.body.email) {
					fs.appendFile("subs.txt", req.body.email + "\n", function() {});
				}
			});

			var httpServer = http.createServer(app);

			httpServer.listen(port, function() {
				console.log('Server listening');
			});
		});
	});
});