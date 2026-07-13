const express = require('express')
const  {
createTask,
getAllTasks,
getTaskByID,
updateStatus,
updateTask,
deleteTask,
getTasksByStatus,
getTasksBySelectedMonth,
getTotalTasks,
getTotalCompletedTask,
getTotalInprogressTask,getTasksByProject
} = require('../controllers/taskController')
const {auth, admin} =require('../middleware/auth')
const uploadFiles = require("../middleware/docMulter");
// const { uploadFiles } = require("../uploads/taskFiles");



const router = express.Router()

router.post("/create",auth,uploadFiles.single("docPath"),createTask);
router.get('/getAll',auth, getAllTasks)
router.get('/getTask/:ID',auth, getTaskByID)
router.patch('/updateStatus/:ID', auth,updateStatus)
router.patch("/updateTask/:ID", auth, uploadFiles.single("docPath"), updateTask);
router.delete('/delete/:ID',auth, deleteTask)
router.get('/getTasksByStatus', auth, getTasksByStatus);
router.get('/getTasksBySelectedMonth', auth, getTasksBySelectedMonth);
router.get('/getTotalTasks', auth, getTotalTasks);
router.get('/getTotalCompletedTask', auth, getTotalCompletedTask);
router.get('/getTotalInprogressTask', auth, getTotalInprogressTask);
router.get("/getTasksByProject/:PROJECT_ID", auth, getTasksByProject);


module.exports = router


// http://localhost:7005/task/create 
// {
//     "title":"Learn MERN",
//     "Description":"ert dfghj tyui bnm",
//     "startDate":"2026-06-10",
//     "endDate":"2026-06-30",

// }