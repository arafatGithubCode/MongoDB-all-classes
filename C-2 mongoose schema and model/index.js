const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;

//create product schema
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//create product model
const product = mongoose.model("products", productSchema);

//connect db
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/productDB");
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to MongoDB");
});
app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectDB();
});
