const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connectDB
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

//create productSchema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//create product model
const Product = mongoose.model("products", productSchema);

//create product
app.post("/products", async (req, res) => {
  try {
    const inputProducts = req.body;
    const productData = await Product.insertMany(inputProducts);
    res.status(200).send({
      success: true,
      message: "products are created",
      data: productData,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//Read products
app.get("/products", async (req, res) => {
  try {
    const price = req.query.price;
    const rating = req.query.rating;
    let products;
    if (price && rating) {
      // products = await Product.find({
      //   $or: [{ price: { $gt: price } }, { rating: { $gt: rating } }],
      // }).countDocuments();

      //1(accending) -1(decending)
      products = await Product.find({
        $or: [{ price: { $gt: price } }, { rating: { $gt: rating } }],
      })
        .sort({ price: -1 })
        .select({ title: 1, _id: 0 });
    } else {
      // products = await Product.find().countDocuments();
      products = await Product.find()
        .sort({ price: -1 })
        .select({ title: 1, _id: 0 });
    }
    res.status(201).send({
      success: true,
      message: "products are created",
      data: products,
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
});

//home route
app.get("/", (req, res) => {
  res.send("I'm home");
});

app.listen(PORT, async () => {
  console.log(`server is running at http:localhost:${PORT}`);
  await connectDB();
});
