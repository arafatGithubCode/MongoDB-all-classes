const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/student")
//   .then(() => console.log("db is connected"))
//   .catch((err) => {
//     console.log("db is not connected");
//     console.log(err);
//     process.exit(1);
//   });

//connect with recommended method
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/student");
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
