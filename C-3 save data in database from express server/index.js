const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//create product schema
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//create product model
const Product = mongoose.model("products", productSchema);

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

app.post("/products", async (req, res) => {
  try {
    //get data from request body
    const { title, price, description } = req.body;

    const newProduct = new Product({
      title,
      price,
      description,
    });

    const productData = await newProduct.save();

    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectDB();
});
