const TaskAssignment = require('../models/taskAssignmentModel')
const Task = require('../models/taskModel')
const User = require('../models/userModel')



async function assignTask(req,res){

    try {
        const {task_id, user_id} = req.body

              // Check Task
        const existingTask = await Task.findById(task_id);

        if (!existingTask) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        // Check User
        const existingUser = await User.findById(user_id);

        if (!existingUser) {
            return res.status(404).send({
                success: false,
                msg: "User not found"
            });
        }

        // Prevent duplicate assignment
        const alreadyAssigned = await TaskAssignment.findOne({
            task_id,
            user_id
        });

        if (alreadyAssigned) {
            return res.status(400).send({
                success: false,
                msg: "Task is already assigned to this user."
            });
        }


        const newAssignment = await TaskAssignment.create({
            task_id:task_id,
            user_id:user_id,
            assignBy:req.user.id
        })

        res.status(200).send({success:true,msg:"Task Assigned Successfully"})

        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}

async function getAllAssignments(req, res) {
    try {

        const assignments = await TaskAssignment.find()
            .populate({
                path: "task_id",
                select: "title description status startDate endDate project_ID",
                populate: {
                    path: "project_ID",
                    select: "title department status"
                }
            })
            .populate({
                path: "user_id",
                select: "name email contactNumber role imgPath"
            })
            .populate({
                path: "assignBy",
                select: "name email role"
            })
            .sort({ createdAt: -1 });

        const result = assignments.map((item) => {

            const assignment = item.toObject();

            if (assignment.user_id && assignment.user_id.imgPath) {
                assignment.user_id.imgPath =
                    `http://localhost:5004${assignment.user_id.imgPath}`;
            }

            return assignment;
        });

        res.status(200).send({
            success: true,
            totalAssignments: result.length,
            assignments: result
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}

async function updateAssignmentStatus(req, res) {
    try {
        const ID = req.params.ID;
        const { status } = req.body;

        const allowedStatus = ["Assigned", "Accepted", "Rejected", "Completed"];

        if (!status || !allowedStatus.includes(status)) {
            return res.status(400).send({
                success: false,
                msg: "Invalid status"
            });
        }

        const assignment = await TaskAssignment.findById(ID);

        if (!assignment) {
            return res.status(404).send({
                success: false,
                msg: "Assignment not found"
            });
        }

        const updatedAssignment = await TaskAssignment.findByIdAndUpdate(
            ID,
            { status },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("task_id", "title description status")
            .populate("user_id", "name email role")
            .populate("assignBy", "name email role");

        res.status(200).send({
            success: true,
            msg: "Assignment status updated successfully",
            assignment: updatedAssignment
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}

module.exports = {
assignTask,
    // assignMultipleUsers,
    // assignMultipleTasks,
    getAllAssignments,
    // getAssignmentById,
    // getUsersByTask,
    // getTasksByUser,
    // getMyAssignedTasks,
    updateAssignmentStatus,
    // changeAssignedUser,
    // removeUserFromTask,
    // removeAllUsersFromTask,
    // removeTaskFromUser,
    // getUnassignedTasks,
    // getUsersWithoutTasks,
    // getAssignmentsByStatus,
    // getAssignmentCount,
    // assignmentDashboard
}