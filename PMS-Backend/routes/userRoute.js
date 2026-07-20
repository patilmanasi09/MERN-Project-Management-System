const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserInfo,
  updateProfile,
  updateUser,
  changePassword,
  getAllUsers,
  totalNumberOfUsers,
} = require("../controllers/userController");
const {auth, admin} = require("../middleware/auth");
const uploadImage = require('../middleware/multer')

// Register
router.post("/register",uploadImage.single('imgPath'), register);

// Login
router.post("/login", login);

// Get Logged-in User Information
router.get("/getUserInfo",auth,  getUserInfo);

router.put("/updateProfile", auth, uploadImage.single("imgPath"), updateProfile);

// Admin: update any user's profile/role by ID
router.put("/updateUser/:ID", auth, admin, uploadImage.single("imgPath"), updateUser);

router.put("/changePassword", auth, changePassword);

router.get("/getAllUsers", auth, getAllUsers);

router.get("/totalNumberOfUsers", auth, totalNumberOfUsers);
module.exports = router;