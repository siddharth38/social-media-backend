const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    googleId: String, // adding top 3 new fields for google authentication and followCount;
    email: String,
    followCount: Number,
    name: String,
    phone: String,
    profession: String,
    dob: String,
    password: String,
    follows: {
      type: [],
    },
    posts: {
      type: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
