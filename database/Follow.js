const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFollow = new Schema({
	userId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	pageRank:  {
		type: String,
		default : "N/A"
	},
	professionalPagerank:  {
		type: String,
		default : "N/A"
	},
	postLike:  {
		type: String,
		default : "N/A"
	},
	postlikeDoctor:  {
		type: String,
		default : "N/A"
	},
	technicalRating: {
		type: String,
		default : "N/A"
	},
	contribution: {
		type: String,
		default : "N/A"
	},
	experience:  {
		type: String,
		default : "N/A"
	},
	numberofPatient: {
		type: String,
		default : "N/A"
	},
	degrees: {
		type: String,
		default : "N/A"
	},
	instituteRating:  {
		type: String,
		default : "N/A"
	},
	proceduresPracticed:  {
		type: String,
		default : "N/A"
	},
	distance:  {
		type: String,
		default : "N/A"
	},
	availability:  {
		type: String,
		default : "N/A"
	},
	charges:  {
		type: String,
		default : "N/A"
	},
	about:  {
		type: String,
		default : "N/A"
	},
	consultationDuration: String,
	rating: String,
	peerRating: String,
	doctorReferral: String,
	patientReferral: String,
	complicationRate: String,
	negligenceCases: String,
	friends: {
		type: []
	},
});

const Follow = mongoose.model("Follow", UserFollow);

module.exports = Follow;