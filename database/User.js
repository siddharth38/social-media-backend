const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  phone: String,
  profession : String,
  dob : String,
  password: String,
  follows: {
		type: []
	},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;