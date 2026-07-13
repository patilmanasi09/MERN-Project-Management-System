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

app.use("/uploads", express.static("uploads"));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});