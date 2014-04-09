var express = require('express');

// configuration ===============================================================
var   app   = express() 								// create our app w/ express
    , port  = process.env.PORT || 5000; 				// set the port

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
	app.use(function(req, res) {
		res.sendfile(__dirname + '/public/html/tripster.html');
	});
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// routes ======================================================================
// require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port, function() {
	console.log("App listening on port " + port);
});
