const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

const MONGO_URL =
  "mongodb+srv://pankajdey:pankaj2025@airbnbcluster.ixxuf1s.mongodb.net/";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  try {
    initData.data = initData.data.map((obj) => ({
      ...obj,
      author: "67ffd29098cd3305473731cf",
    }));
    await Listing.insertMany(initData.data);
    console.log("initialised data");
  } catch (error) {
    console.error("Validation errors", error.errors || error.writeErrors);
  }
};

initDB();
