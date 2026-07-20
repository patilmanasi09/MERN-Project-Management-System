const express = require("express");
const cors = require("cors");
const path = require('path')
require("dotenv").config();

const connectDB  = require("./config/db");

const taskRouter = require("./routes/tasksRoute");
const userRouter = require("./routes/userRoute");
const projectRouter = require("./routes/projectsRoute");
const taskAssignmentRouter = require("./routes/taskAssignmentRoute");
const roleRequestRouter = require("./routes/roleRequestRoute");
const departmentRouter = require("./routes/departmentRoute");


const app = express();
const port = process.env.PORT || 5003;

// connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))

app.use("/tasks", taskRouter);
app.use("/user", userRouter);
app.use("/project", projectRouter);
app.use("/assign", taskAssignmentRouter);
app.use("/roleRequest", roleRequestRouter);
app.use("/department", departmentRouter);

app.use("/uploads", express.static("uploads"));

// Catch-all error handler: multer errors, malformed multipart bodies, and any
// error passed to next() land here instead of crashing with a bare 500.
app.use((err, req, res, next) => {
  console.log("Unhandled error:", err.message);

  res.status(err.status || 500).send({
    success: false,
    msg: err.message || "Server Error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});