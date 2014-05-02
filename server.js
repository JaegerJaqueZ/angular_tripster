var express = require('express');

// configuration ===============================================================
var   app   = express(); 						  			// create our app w/ express
 
app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// routes ======================================================================
// require('./app/routes.js')(app);

// application -------------------------------------------------------------
app.get('/', function(req, res) {
	res.sendfile('./public/html/tripster.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.sendfile('./public/html/partials/' + name);
});

// listen (start app with node server.js) ======================================

var os = require('os')

var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

console.log(addresses)

app.listen(8000);
console.log("App listening on port 8000");