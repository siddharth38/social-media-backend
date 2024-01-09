const mongoose = require("mongoose");
const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://siddharthkumar28717:ajw065123@cluster0.9zd0gig.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = { connectToDatabase, connection: mongoose.connection };
