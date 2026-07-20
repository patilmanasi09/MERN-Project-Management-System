const Project = require('../models/projectModel')
const {validateProject} = require('../services/projectValidation')


async function createproject(req,res){
    const {title,description, startDate, endDate,department } = req.body
    try{
        const existingProject = await Project.findOne({title:title})
        if(existingProject){
            return res.status(400).send({success:true,msg:"!!!!change project title!!!!"})
        }
        const pValidate = await validateProject({title,description, startDate, endDate,department })
        if (!pValidate.success) {
            return res.status(400).send(pValidate);
        }
        const newProject = await Project.create({title:title,
            description:description, 
            startDate:startDate, 
            endDate:endDate,
            department:department,
            createdBy:req.user.id
            })
        await newProject.save()
        res.status(200).send({success:true,msg:"Project created Successfully"})
    }catch(error) {
        console.log(error.message)
        res.status(500).send({success:false, msg: error.message || "Server Error"})
    }
} 



async function getAllprojects(req,res){
    try{
        const getAll = await Project.find({},{createdBy:0, createdAt:0,updatedAt:0})

        res.status(200).send({success:true,projects:getAll})

    }catch(error) {
        console.log(error.message)
        res.status(500).send({success:false, msg: error.message || "Server Error"})
    }
} 


async function getprojectByID(req,res){
    try{
        const ID = req.params.ID
        const projectById = await Project.findById(ID)
        if(!projectById){
            return res.status(400).send({success:false,msg:"Project not found"})
        }
        res.status(200).send({success:true,project:projectById})


    }catch(error) {
        console.log(error.message)
        res.status(500).send({success:false, msg: error.message || "Server Error"})
    }
} 


async function updateStatus(req,res){
    try{
        const ID = req.params.ID
        const projectById = await Project.findById(ID)
        if(!projectById){
            return res.status(400).send({success:false,msg:"Project not found"})
        }
        const {status} = req.body 
        const updatedProject = await Project.findByIdAndUpdate(ID, {status:status})
        if(!updatedProject){
            return  res.status(400).send({success:false,msg:"Project not updated"})
        }
        return res.status(200).send({success:true,msg:"Project updated successfuly"})

    }catch(error) {
        console.log(error.message)
        res.status(500).send({success:false, msg: error.message || "Server Error"})
    }
} 

async function updateproject(req, res) {
    try {
        const ID = req.params.ID;

        const project = await Project.findById(ID);

        if (!project) {
            return res.status(404).send({
                success: false,
                msg: "Project not found"
            });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            ID,
            { $set: req.body },
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).send({
            success: true,
            msg: "Project updated successfully",
            project: updatedProject,
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).send({
            success: false,
            msg: error.message || "Server Error",
        });
    }
}


async function deleteproject(req, res) {
    try {

        const ID = req.params.ID;

        const project = await Project.findById(ID);

        if (!project) {
            return res.status(404).send({
                success: false,
                msg: "Project not found"
            });
        }

        await Project.findByIdAndDelete(ID);

        return res.status(200).send({
            success: true,
            msg: "Project deleted successfully"
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}


async function getTotalprojects(req, res) {
    try {

        const totalProjects = await Project.countDocuments();

        res.status(200).send({
            success: true,
            totalProjects
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}

// Get Projects By Status
async function getprojectsByStatus(req, res) {
    try {

        const { status } = req.query;

        const projects = await Project.find({ status });

        res.status(200).send({
            success: true,
            projects
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}


// Get Projects By Selected Month


const getprojectsBySelectedMonth = async (req, res) => {
    try {
        console.log("Query:", req.query);

        const month = Number(req.query.month);
        const year = Number(req.query.year);

        console.log("Month:", month);
        console.log("Year:", year);

        if (isNaN(month) || isNaN(year)) {
            return res.status(400).json({
                success: false,
                msg: "Month and year must be numbers."
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const projects = await Project.find({
            startDate: {
                $gte: startDate,
                $lt: endDate
            }
        });

        return res.status(200).json({
            success: true,
            totalProjects: projects.length,
            projects
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};



// Get Total Completed Projects
async function getTotalCompletedproject(req, res) {
    try {

        const totalCompletedProjects = await Project.countDocuments({
            status: "Completed"
        });

        res.status(200).send({
            success: true,
            totalCompletedProjects
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}


// Get Total In Progress Projects
async function getTotalInprogressproject(req, res) {
    try {

        const totalInprogressProjects = await Project.countDocuments({
            status: "In Progress"
        });

        res.status(200).send({
            success: true,
            totalInprogressProjects
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}


// Get Total Pending Projects
async function getTotalPendingProjects(req, res) {
    try {

        const totalPendingProjects = await Project.countDocuments({
            status: "Pending"
        });

        res.status(200).send({
            success: true,
            totalPendingProjects
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({ success: false, msg: error.message || "Server Error" });
    }
}

module.exports = {
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
}