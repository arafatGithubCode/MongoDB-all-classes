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
  createdAt: {
    type: Date,
    default: Date.now,
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

//create product
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    });

    const productData = await newProduct.save();

    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Read or find all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    // const products = await Product.find().limit(2);
    if (products) {
      res.status(202).send({
        success: true,
        message: "Return all products",
        data: products,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "products are not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//find single product by id
app.get("/products/:id", async (req, res) => {
  try {
    //1(true/show), 0(false/hide)
    const id = req.params.id;

    const product = await Product.findOne({ _id: id });

    // const products = await Product.findOne({ _id: id }).select({
    //   title: 1,
    //   _id: 0,
    //   price: 1,
    // });

    //same job done without select method
    // const products = await Product.findOne(
    //   { _id: id },
    //   { title: 1, _id: 0, price: 1 }
    // );

    if (product) {
      res.status(202).send({
        success: true,
        message: "Return single product",
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "product is not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//home route
app.get("/", (req, res) => [res.send("Multiple document insert in MongoDB ")]);

app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectDB();
});

//database -> collection -> documents

//CRUD operation

//post: /products  -> create a product
//get: /products  -> return all products
//get: /products/:id  -> return specific products
//put: /products/:id  -> update a product based on id
//delete: /products/:id  -> delete a product based on id
