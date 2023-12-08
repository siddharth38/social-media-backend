const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: { type: String},
    file: {
      image: { type: String }, 
      type: { type: String }, 
    },
    users: Array,
    sender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
