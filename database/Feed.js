const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Feed = new Schema({
	userId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},

	likes:{ 
		type :Number ,
	default : 0},

    content: {
		type: String,
	},

	image: {
		type: String,
		default: "",
	  },
	  type: {
		type: String,
		default: "",
	  },
	  comment: {
		type: [],
	  },
	timestamp: {
		 type: Date, default: Date.now 
	}
});

const Feeds = mongoose.model("Feed", Feed);

module.exports = Feeds;
