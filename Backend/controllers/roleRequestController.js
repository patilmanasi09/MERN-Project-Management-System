const RoleRequest = require("../models/roleRequestModel");
const User = require("../models/userModel");

// Apply for HOD
async function applyForHOD(req, res) {
  try {
    const user_id = req.user.id;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (user.role === "HOD") {
      return res.status(400).json({
        success: false,
        msg: "You are already HOD",
      });
    }

    // Check if request already exists
    const existingRequest = await RoleRequest.findOne({
      user_ID: user_id,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        msg: "Your HOD request is already pending",
      });
    }

    // Create request
    const request = await RoleRequest.create({
      user_ID: user_id,
      requestedRole: "HOD",
    });

    return res.status(201).json({
      success: true,
      msg: "HOD request submitted successfully",
      request,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

// Get all requests
async function getAllRoleRequests(req, res) {
  try {
    const requests = await RoleRequest.find()
      .populate("user_ID", "name email contactNumber role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalRequests: requests.length,
      requests,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

// Approve request
async function approveHODRequest(req, res) {
  try {
    const ID = req.params.ID;

    const request = await RoleRequest.findById(ID);

    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        msg: "Request already processed",
      });
    }

    // Update user role
    await User.findByIdAndUpdate(
      request.user_ID,
      {
        role: "HOD",
      },
      {
        new: true,
      }
    );

    request.status = "Approved";
    request.reviewedBy = req.user.id;

    await request.save();

    return res.status(200).json({
      success: true,
      msg: "User role changed to HOD successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

// Reject request
async function rejectHODRequest(req, res) {
  try {
    const ID = req.params.ID;
    const { remark } = req.body;

    const request = await RoleRequest.findById(ID);

   console.log("Request ID:", ID);
console.log("Request:", request);

if (request) {
    console.log("Status:", request.status);
      return res.status(404).json({
        success: false,
        msg: "Request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        msg: "Request already processed",
      });
    }

    request.status = "Rejected";
    request.reviewedBy = req.user.id;
    request.remark = remark || "Request rejected by Admin";

    await request.save();

    return res.status(200).json({
      success: true,
      msg: "HOD request rejected successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

module.exports = {
  applyForHOD,
  getAllRoleRequests,
  approveHODRequest,
  rejectHODRequest,
};