// const mongoose = require("mongoose");

// const assignTaskUserSchema = new mongoose.Schema(
//   {
//     taskId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Task",
//       required: true,
//     },

//     projectId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     assignedDate: {
//       type: Date,
//       required: true,
//     },

//     status: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("AssignTaskUser", assignTaskUserSchema);