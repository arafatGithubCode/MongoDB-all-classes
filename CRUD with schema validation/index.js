const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connectDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/teacherDB");
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

//create schema with validation
const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Teacher name is required"],
    minlength: [6, "Minimum length of name should be 6 characters"],
    maxlength: [15, "Maximum length of name should be less then 15 characters"],
    uppercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Teacher email is required"],
    unique: true,
    validate: {
      validator: (v) => {
        return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(v);
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    validate: {
      validator: (v) => {
        const phoneRegex = /\d{3}-\d{4}-\d{4}/.test(v);
        return phoneRegex;
      },
    },
    message: (props) => `${props.value} is not a valid phone number`,
  },
  department: {
    type: String,
    required: [true, "Department name is required"],
    validate: {
      validator: (v) => {
        return v.length === 3;
      },
      message: (props) => `${props.value} is  not a valid department acronym`,
    },
  },
  age: {
    type: Number,
    required: [true, "teacher's age is required"],
    min: [23, "Minimum age of teachers should be greater then 23 years"],
    max: [60, "Maximum age of teachers should be less then 60 years"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//create teacher model
const Teacher = mongoose.model("teachers", teacherSchema);

//create teacher docs
app.post("/teachers", async (req, res) => {
  try {
    const { fullName, email, phone, department, age } = req.body;
    const newTeacher = new Teacher({
      fullName,
      email,
      phone,
      department,
      age,
    });
    const teacherData = await newTeacher.save();
    res.status(200).send({
      success: true,
      message: "Teacher document was created",
      data: teacherData,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//read teachers
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    if (teachers) {
      res.status(201).send({
        success: true,
        message: "Return all teachers",
        data: teachers,
      });
    } else {
      res.send({ message: "teacher data was not found" });
    }
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

//update teacher
app.put("/teachers/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updateTeacher = await Teacher.findByIdAndUpdate(
      { _id: teacherId },
      {
        $set: {
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          department: req.body.department,
          age: req.body.age,
        },
      },
      { new: true }
    );
    if (updateTeacher) {
      res.status(202).send({
        success: true,
        message: `A teacher was updated with this id: ${teacherId}`,
        data: updateTeacher,
      });
    } else {
      res.send({
        message: `Teacher could not update with this id: ${teacherId}`,
      });
    }
  } catch (error) {
    res.status(402).send({
      success: false,
      message: error.message,
    });
  }
});

//delete teacher
app.delete("/teachers/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;
    const deleteTeacher = await Teacher.findByIdAndDelete({ _id: teacherId });
    if (deleteTeacher) {
      res.status(203).send({
        success: true,
        message: `A teacher was deleted with this id: ${teacherId}`,
      });
    } else {
      res.send({
        message: `Teacher could not delete with this id: ${teacherId}`,
      });
    }
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

//home route
app.get("/", (req, res) => {
  res.send("<h1>CRUD Operation with schema validation");
});

app.listen(PORT, async () => {
  console.log(`server is running at http:localhost:${PORT}`);
  await connectDB();
});
