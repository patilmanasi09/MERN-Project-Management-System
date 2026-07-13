const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserInfo,
  updateProfile,
  changePassword,
  getAllUsers,
  totalNumberOfUsers,
} = require("../controllers/userController");
const {auth} = require("../middleware/auth");
const uploadImage = require('../middleware/multer')

// Register
router.post("/register",uploadImage.single('imgPath'), register);

// Login
router.post("/login", login);

// Get Logged-in User Information
router.get("/getUserInfo",auth,  getUserInfo);

router.put("/updateProfile", auth, uploadImage.single("imgPath"), updateProfile);

router.put("/changePassword", auth, changePassword);

router.get("/getAllUsers", auth, getAllUsers);

router.get("/totalNumberOfUsers", auth, totalNumberOfUsers);
module.exports = router;