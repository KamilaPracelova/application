var User		= require('../models/user');
var jwt			= require('jsonwebtoken'); // login user 
var secret		= 'diplomovka';


// import into server file
module.exports = function(router){

	// USER REGISTRATION ROUTE
	// create a route for users to register
	// post- create something or entering data to database
	// http://localhost:8080/api/users
	router.post('/users', function(req, res) {
		//res.send('testing users route');  //testing
		// create a local variable user
		var user = new User();
		user.name = req.body.name;
		user.username = req.body.username; 	// take the request that has been sent and save it to variable user.username 
		user.password = req.body.password;
		user.email = req.body.email;
		// if this is not provided do this
		if (req.body.name == null || req.body.name == '' || req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' ) {
			res.json({success: false, message: 'Ensure username, email, and password were porovided'});
		} else {
			user.save(function(err) {
				if (err) { // if error check for validation
					if(err.errors != null) {
						if (err.errors.name) {
							res.json({success: false, message: err.errors.name.message });
						} else if (err.errors.email) {
							res.json({success: false, message: err.errors.email.message });
						} else if (err.errors.username) {
							res.json({success: false, message: err.errors.username.message });
						} else if (err.errors.password) {
							res.json({success: false, message: err.errors.password.message });
						} else {
							res.json({ success: false, message: err});
						}
					} else if (err) { // if it is not validation error check for duplications 
						if (err.code == 11000) { // code for duplication
							if (err.errmsg[61] == "u") { // if 61st char of error message is letter u
								res.json({ success: false, message: 'Username is already taken.' });
							} else if (err.errmsg[61] == "e") {
								res.json({ success: false, message: 'E-mail adress is already taken.' });
						}
						} else {
							res.json({ success: false, message: err });
						}
					}
				} else { // if there is no error with duplications it is valide
					res.json({success: true, message: 'User created'});
				} 
			});	// save fction it to the database
		}
	});

	// validation during registration - if is username taken already 
	router.post('/checkusername', function(req,res) {
			User.findOne({ username: req.body.username}).select('username').exec(function(err,user){
				if (err) throw err;

				if(user) {
					res.json({ success:false, message: 'That username is already taken'});
				} else {
					res.json({ success: true, message: 'Valid username'});
				}
			});
	});

	// validation during registration - if is email taken already 
	router.post('/checkemail', function(req,res) {
			User.findOne({ email: req.body.email}).select('email').exec(function(err,user){
				if (err) throw err;

				if(user) {
					res.json({ success:false, message: 'That email is already taken'});
				} else {
					res.json({ success: true, message: 'Valid email'});
				}
			});
	});

	// USER LOGIN ROUTE
	// http://localhost:8080/api/authenticate
	router.post('/authenticate', function(req,res) {
			User.findOne({ username: req.body.username}).select('email username password').exec(function(err,user){
				if (err) throw err;

				if (!user) {
					res.json({success: false, message: 'Could not authenticate user'});
				} else if (user) {
					if (req.body.password) {
						var validPassword = user.comparePassword(req.body.password);
					if (!validPassword) {
  						res.json({success : false, message : 'Could not authenticate password!'});  
					} else {
						var token = jwt.sign({ username: user.username, email: user.email }, secret , { expiresIn: '24h' }); // after 24h token will not be longer usable
  						res.json({success : true, message : 'User authenticated!', token : token});
 					} }
 					else { res.json({success : false, message : 'Not password provided!'});
					} }
			});
	});

	//middleware
	router.use(function(req, res, next){
		var token = req.body.token || req.body.query || req.headers['x-access-token']; // get from request or url or headers
		
		if (token) {
			// verify a token
			jwt.verify(token, secret, function(err, decoded) {
				if (err) {
					res.json({success: false, message: 'Token invalid.'});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.json({success:false, message: 'No token provided.'});
		}

	});

	// get current user
	router.post('/me', function(req,res) {
		res.send(req.decoded);
	});

	return router;
}