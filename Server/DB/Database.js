const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();

async function Connection() {
  const URL = process.env.MongoDBURL;

  try {
    await mongoose.connect(URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    // process.exit(1); 
  }
}

module.exports = Connection;
