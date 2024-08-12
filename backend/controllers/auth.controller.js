import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  // Log the request body
  console.log("[signup] request body: ", req.body);

  // Destructure email, password, and name from the request body
  const { email, password, name } = req.body;

  try {
    // Check if any of the fields are missing
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    // Log the email, password, and name
    console.log("[signup] email, password, name: ", email, password, name);

    // Check if a user with the same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("[signup] user already exists");
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 24 * 24 * 1000, // 24 hours
    });

    // Log that the user has been created
    console.log("[signup] user created, saving to db");

    // Save the user to the database
    await user.save();

    // Generate a JWT token and set it as a cookie
    generateTokenAndSetCookie(res, user._id);

    // Log that the verification email is being sent and send the email
    console.log("[signup] sending verification email");
    await sendVerificationEmail(user.email, user.verificationToken);
    console.log("[signup] verification email sent");

    // Send a success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    // Log the error and send a failure response
    console.log("[signup] error: ", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body; // get verification code from request body

  try {
    // find user with the verification code
    const user = await User.findOne({
      verificationToken: code, // check if verification code is correct
      verificationTokenExpiresAt: { $gt: Date.now() }, // check if verification code is not expired
    });

    // if no user found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // if user found, update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // send response
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      // send user data without password
      user: {
        ...user._doc,
        password: undefined,
      },
    });

    // send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // deal with errors
  } catch (error) {
    console.log("Error verifying email", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password); // check if password is correct
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(error);
  }
};

export const signout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Signout successful" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset email sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Destructure token and password from request parameters and body
    const { token } = req.params;
    const { password } = req.body;

    // Find user with matching token and not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    // If no user found, return error
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user password and remove reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // Send success email
    await sendResetSuccessEmail(user.email, user.name);

    // Return success message
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    // Log error and return error response
    console.log("Error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Checks if the user is authenticated by finding the user by ID  and returning the user object with the password field removed.
export const checkAuth = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.userId);
    // If user not found, return error
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    // Return success response with user object with password field removed
    res.status(200).json({
      success: true,
      user: {
        ...user._doc, // Spread user object
        password: undefined, // Remove password field
      },
    });
  } catch (error) {
    // Log error and return server error response
    console.log("Error in checkAuth", error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};
