const Department = require('../models/departmentModel')

async function createDepartment(req, res) {
    try {
        const { departmentName, departmentCode, description, status } = req.body

        const existing = await Department.findOne({
            $or: [{ departmentName }, { departmentCode }]
        })

        if (existing) {
            return res.status(400).send({
                success: false,
                msg: "A department with this name or code already exists"
            })
        }

        const newDepartment = await Department.create({
            departmentName,
            departmentCode,
            description,
            status: status || "Active",
            createdBy: req.user.id
        })

        res.status(201).send({
            success: true,
            msg: "Department created successfully",
            department: newDepartment
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, msg: error.message || "Server Error" })
    }
}

async function getAllDepartments(req, res) {
    try {
        const departments = await Department.find().sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            departments
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, msg: error.message || "Server Error" })
    }
}

async function updateDepartment(req, res) {
    try {
        const ID = req.params.ID

        const updated = await Department.findByIdAndUpdate(
            ID,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!updated) {
            return res.status(404).send({ success: false, msg: "Department not found" })
        }

        res.status(200).send({
            success: true,
            msg: "Department updated successfully",
            department: updated
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, msg: error.message || "Server Error" })
    }
}

async function deleteDepartment(req, res) {
    try {
        const ID = req.params.ID

        const deleted = await Department.findByIdAndDelete(ID)

        if (!deleted) {
            return res.status(404).send({ success: false, msg: "Department not found" })
        }

        res.status(200).send({
            success: true,
            msg: "Department deleted successfully"
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, msg: error.message || "Server Error" })
    }
}

module.exports = {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
}
