const Task = require("../models/taskModel");
const { validateTask } = require("../services/taskValidation");
const Project = require("../models/projectModel");

// Create Task
async function createTask(req, res) {
    try {
        const {
            project_ID,
            title,
            description,
            startDate,
            endDate
        } = req.body;

        const project = await Project.findById(project_ID);

        if (!project) {
            return res.status(404).send({
                success: false,
                msg: "Project not found"
            });
        }

        const docPath = req.file ? req.file.filename : "";

        const newTask = await Task.create({
            project_ID,
            title,
            description,
            startDate,
            endDate,
            createdBy: req.user.id,
            docPath
        });

        res.status(201).send({
            success: true,
            msg: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

async function getAllTasks(req, res) {
    try {
        const tasks = await Task.find()
            .populate("project_ID", "title department status")
            .populate("createdBy", "name email role");

        res.status(200).send({
            success: true,
            tasks
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

async function getTaskByID(req, res) {
    try {
        const ID = req.params.ID;

        const task = await Task.findById(ID)
            .populate("project_ID", "title department status")
            .populate("createdBy", "name email role");

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        // Convert mongoose document to plain object
        const taskData = task.toObject();

        // Absolute URL for downloading document
        if (taskData.docPath) {
            taskData.docPath = `http://localhost:5004/uploads/taskFiles/${taskData.docPath}`;
        }

        res.status(200).send({
            success: true,
            taskData
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

// Update Task Status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.ID,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const docPath = req.file ? req.file.filename : "";

    const updateData = {
      ...req.body,
    };

    // Only update docPath if a new file is uploaded
    if (docPath) {
      updateData.docPath = docPath;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.ID,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.ID);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Tasks By Project
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({
      project_ID: req.params.PROJECT_ID,
    });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Tasks By Status
const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    const tasks = await Task.find({ status });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Tasks By Selected Month
const getTasksBySelectedMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const tasks = await Task.find({
      startDate: {
        $gte: start,
        $lt: end,
      },
    });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Total Tasks
const getTotalTasks = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      totalTasks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Total Completed Tasks
const getTotalCompletedTask = async (req, res) => {
  try {
    const totalCompletedTask = await Task.countDocuments({
      status: "Completed",
    });

    res.status(200).json({
      success: true,
      totalCompletedTask,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Total In Progress Tasks
const getTotalInprogressTask = async (req, res) => {
  try {
    const totalInprogressTask = await Task.countDocuments({
      status: "In Progress",
    });

    res.status(200).json({
      success: true,
      totalInprogressTask,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskByID,
  updateStatus,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByStatus,
  getTasksBySelectedMonth,
  getTotalTasks,
  getTotalCompletedTask,
  getTotalInprogressTask,
};

