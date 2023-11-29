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
    required: [true, "product title is required"],
    minlength: [3, "Minimum length of product title should be 3"],
    maxlength: [100, "Maximum length of product title should be 10"],
    lowercase: true, //store in db as upper/lowercase
    trim: true, //unnecessary space ignored
    // enum: ["ipnoe16", "Galaxy5"], //title should be between enum value
    // enum: {
    //   values: ["iphone16", "node7"],
    //   message: "{VALUE} is not supported",
    // },
  },
  price: {
    type: Number,
    min: [200, "Minimum price of product should be 200"],
    max: [2000, "Maximum price of product should be 2000"],
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
  email: {
    type: String,
    unique: true,
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
      }).sort({ price: -1 });
    } else {
      // products = await Product.find().countDocuments();
      products = await Product.find().sort({ price: -1 });
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

//delete operation
app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const deleteProduct = await Product.deleteOne({ _id: id });
    const deleteProduct = await Product.findByIdAndDelete({ _id: id });
    if (deleteProduct) {
      res.status(202).send({
        success: true,
        message: `A product was deleted with this id: ${id}}`,
        data: deleteProduct,
      });
    } else {
      res.status(402).send({
        success: false,
        message: `Products could not find with this id: ${id}`,
      });
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
});

//update product
app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const updatedProduct = await Product.updateOne(
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          rating: req.body.rating,
          description: req.body.description,
        },
      },
      { new: true }
    );
    if (updatedProduct) {
      res.status(202).send({
        success: true,
        message: `A product was updated with this id: ${id}`,
        data: updatedProduct,
      });
    } else {
      res.status.select({ message: "product not found" });
    }
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
