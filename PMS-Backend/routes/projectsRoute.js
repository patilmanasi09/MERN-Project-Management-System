const express = require('express')
const  {
createproject,
getAllprojects,
getprojectByID,
updateStatus,
updateproject,
deleteproject,
getTotalprojects,
getprojectsByStatus,
getprojectsBySelectedMonth,
getTotalCompletedproject,
getTotalInprogressproject,
getTotalPendingProjects
} = require('../controllers/projectController')
const {auth, admin, hod} =require('../middleware/auth')

const router = express.Router()

router.post('/create',auth, hod,createproject)
router.get('/getAll',auth, getAllprojects)
router.get('/getproject/:ID',auth, getprojectByID)
router.patch('/updateStatus/:ID', auth,hod,updateStatus)
router.put('/updateproject/:ID',auth,hod, updateproject)
router.delete('/delete/:ID',auth,admin, deleteproject)
router.get('/getTotalprojects',auth,getTotalprojects)
router.get('/getprojectsByStatus', auth, getprojectsByStatus);
router.get('/getprojectsBySelectedMonth', auth, getprojectsBySelectedMonth);
router.get('/getTotalCompletedproject', auth, getTotalCompletedproject);
router.get('/getTotalInprogressproject', auth, getTotalInprogressproject);
router.get('/getTotalPendingProjects', auth, getTotalPendingProjects);


module.exports = router


// http://localhost:7005/project/create 
// {
//     "title":"Learn MERN",
//     "Description":"ert dfghj tyui bnm",
//     "startDate":"2026-06-10",
//     "endDate":"2026-06-30",

// }