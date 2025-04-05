const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const nodemailer = require("nodemailer");

// Register

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists with same Email Id, Try again!",
      });
    }

    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashpassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
};

//Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
        userName: existingUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );
    res.status(200).json({
      success: true,
      message: "Successfully Logged In",
      token,
      user: {
        id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
        userName: existingUser.userName,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Logging User",
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1hr",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const reciver = {
      from: "akabeemvp@gmail.com",
      to: email,
      subject: "Reset Password Request",
      text: `To reset your password, please click the link: ${process.env.CLIENT_BASE_URL}/auth/reset-password/${token}`,
    };
    await transporter.sendMail(reciver);

    res.status(200).json({
      success: true,
      message: "Password reset Link Sent Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Error processing forgot password request",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const newhashPassword = await bcrypt.hash(password, 12);
    user.password = newhashPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

//Logout
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "User Logged Out",
  });
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
};
