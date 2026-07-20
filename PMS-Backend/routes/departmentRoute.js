const express = require('express')
const router = express.Router()

const {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController')

const { auth, admin } = require('../middleware/auth')

router.post('/create', auth, admin, createDepartment)
router.get('/getAll', auth, getAllDepartments)
router.put('/update/:ID', auth, admin, updateDepartment)
router.delete('/delete/:ID', auth, admin, deleteDepartment)

module.exports = router
