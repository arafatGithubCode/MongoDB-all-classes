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
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

//create usersSchema
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//create user model
const User = mongoose.model("users", usersSchema);

//create users
app.post("/users", async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const newUser = new User({
      name,
      age,
      email,
    });
    const userdata = await newUser.save();
    res.status(202).send({
      success: true,
      message: "user is created",
      data: userdata,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//read or find user
app.get("/users", async (req, res) => {
  try {
    const age = req.query.age;
    let users = null;
    if (age) {
      users = await User.find({ age: { $gt: age } });
    } else {
      users = await User.find();
    }
    if (users) {
      res.send({
        success: true,
        message: "Return all users",
        data: users,
      });
    } else {
      res.send({
        success: false,
        message: "Users are not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//home route
app.get("/", (req, res) => {
  res.send("MongoDB create and read master finishing");
});

app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectDB();
});
