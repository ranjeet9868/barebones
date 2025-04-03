const mongoose = require("mongoose");


const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/barebones-app", {
    useNewUrlParser: true,
    // useUnifiedTopology: true, //useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js 
    // Driver version 4.0.0 and will be removed in the next major version
  });
  console.log("MongoDB connected");
};

module.exports = connectDB;
