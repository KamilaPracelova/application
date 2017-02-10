// packages
var express 	= require('express');
var app 		= express();
var port 		= process.env.PORT || 8080;
var morgan 		= require('morgan');
var mongoose 	= require('mongoose');
var bodyParser  = require('body-parser'); // to parse data to JSON is used express middleware bodyParser
var router		= express.Router();
var appRoutes 	= require('./app/routes/api')(router);
var path		= require('path');
var passport	= require('passport'); // login with facebook
var social		= require('./app/passport/passport')(app, passport);

//middlewares // order important !
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // frontend has acces to public folder - all angular controllers // starting from this folder
app.use('/api', appRoutes);

//mongo database connection
// tutorial - name of database
// connect to database tutorial to the port 27017
mongoose.connect('mongodb://localhost:27017/tutorial', function(err) {
	// if there is an error than log 'Not connected to the database:'
	if (err) {
		console.log('Not connected to the database: ' + err);
	// if there is no error 'Succesfully connected to MongoDB'	
	} else {
		console.log('Succesfully connected to MongoDB');
	}
});

//html
// * always this page
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//server port
app.listen(port, function() {
	console.log('Running the server on port' + port);
});