const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.MONGODB_URI

// raise error on anything else
main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(mongoDB);
}

const db = mongoose.connection;
// raise error on connection failure
db.on("error", console.error.bind(console, "mongo connection error"));