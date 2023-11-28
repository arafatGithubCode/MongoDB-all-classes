const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

//create schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

//create product model
const Product = mongoose.model("products", productSchema);

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

app.post("/products", async (req, res) => {
  try {
    const products = req.body;

    const productData = await Product.insertMany(products);

    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/", (req, res) => [res.send("Multiple document insert in MongoDB ")]);

app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectDB();
});
