// invokes mongoose module
var mongoose 	= require('mongoose');
// uses mongoose method Schema and saves to variable Schema
var Schema 		= mongoose.Schema;
var bcrypt 		= require('bcrypt-nodejs');
var titlize   = require('mongoose-title-case');
var validate = require('mongoose-validator');

// validate name
var nameValidator = [
    validate({
      validator: 'matches',
      arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/, // field must have these specifics only : from a to z lowercase and A to Z uppercase // 2 words at least 3 and max 20 letters
      message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space between'
    }),
    validate({
      validator: 'isLength',
      arguments: [3, 25], // name is long from 3 to 25 characters
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters' 
    })
];

// validate username
var usernameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 25],
      message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
      validator: 'isAlphanumeric',
      message: 'Username must be one word and must contain letters and numbers only.'
    })
];

// validate password
var passwordValidator = [
    validate({
      validator: 'matches',
      arguments: /^((?=.*?[a-z])((?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35})$)/, // ?=.*? match at least one // \d number // \W special symbol // at least 8 charcters, no longer than 35
      message: 'Password needst to have at least lowercase, one uppercase, one number, one special character, must be at least 8 characters and max 35 characters long'
    }),
    validate({
      validator: 'isLength',
      arguments: [8, 35], // password is long from 3 to 25 characters
      message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters' 
    })
];

// validate email
var emailValidator = [
    validate({
      validator: 'isEmail',
      message: 'Is not a valid e-mail'
    }),
    validate({
      validator: 'isLength',
      arguments: [3, 55],
      message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// create a  new schema
// {} object
var UserSchema = new Schema({
  name: { type: String, required: true, validate: nameValidator },
  username: {type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
  password: {type: String, required: true, validate: passwordValidator},
  email: {type: String, required: true, lowercase: true, unique: true, validate: emailValidator}
});

// mongoose middleware
// before saving password encrypt it
UserSchema.pre('save', function(next) {
  var user = this; // whatever is user running through this middleware
  bcrypt.hash(user.password, null, null, function(err, hash){ // encryption method // https://www.npmjs.com/package/bcrypt-nodejs
    if (err) return next(err);
    user.password = hash;     // Store hash in your password DB.
    next();
  });
});

// Mongoose.js plugin for titlizing & trimming model paths
UserSchema.plugin(titlize, {
  paths: [ 'name']
});

// method for validating a password
UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password); // compare password provider bz the user to the hash
};

//export it to server file
// User - name of model
// call it by variable name - UserSchema
module.exports = mongoose.model('User', UserSchema);