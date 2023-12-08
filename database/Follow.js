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
	pageRank: String,
	professionalPagerank: String,
	postLike: String,
	postlikeDoctor: String,
	technicalRating: String,
	contribution: String,
	experience: String,
	numberofPatient: String,
	degrees: String,
	instituteRating: String,
	proceduresPracticed: String,
	distance: String,
	availability: String,
	charges: String,
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