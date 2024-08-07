import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      // create new user
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 24 * 24 * 1000, // 24 hours
    });

    await user.save(); // save user to db

    //jwt
    generateTokenAndSetCookie(res, user._id); // generate token and set cookie

    await sendVerificationEmail(user.email, user.verificationToken); // send verification email
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
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
  res.send("Signin route");
};

export const signout = async (req, res) => {
  res.send("Signout route");
};
