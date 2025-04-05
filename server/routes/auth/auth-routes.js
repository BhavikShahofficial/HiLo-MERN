const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
} = require("../../controllers/auth/auth-controllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    message: "You are authenticated",
    success: true,
    user: user,
  });
});

module.exports = router;
