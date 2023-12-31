import express from "express";
import fs from "fs";
const router = express();
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { jsontoken } from "../utils/jwt.js";
import { auth } from "../middleware/auth.js";
import upload from "../utils/upload.js";
import getDatauri from "../utils/dataUri.js";
import { uploader } from "../utils/cloudinaryConfig.js";

// register user
router.post("/register", upload.single("userImg"), async (req, res) => {
  try {
    let userImage;
    if (req?.file) {
      const file = getDatauri(req.file);
      const uploadFile = await uploader.upload(file.content);
      userImage = uploadFile.secure_url;
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password || !userImage) {
      return res.status(401).json("Please fill all data");
    }

    const validate = validator.isEmail(email);
    if (!validate) {
      return res.status(401).json("Please enter valid email");
    }

    const bcrpass = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: bcrpass,
      image: userImage,
    });
    const token = jsontoken(user._id);
    return res.status(201).json({ token, user });
  } catch (e) {
    console.log(e);
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json("Please fill all data");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json("Email or Password are Incorrect");
    }

    const checkpass = await bcrypt.compare(password, user.password);
    if (!checkpass) {
      return res.status(401).json("Email or Password are Incorrect");
    }

    const token = jsontoken(user._id);
    return res.status(201).json({ token, user });
  } catch (e) {
    return res.status(400).json(e);
  }
});

// get all users
router.get("/", auth, async (req, res) => {
  try {
    const data = await userModel.find();
    res.status(201).json(data);
  } catch (e) {
    console.log(e);
  }
});

// get single user
router.get("/:id", auth, async (req, res) => {
  try {
    const data = await userModel.findById(req.params.id);
    res.status(201).json(data);
  } catch (e) {
    console.log(e);
  }
});

// update user
router.put("/edit/:id", auth, upload.single("userImg"), async (req, res) => {
  try {
    let userImage;
    if (req?.file) {
      const file = getDatauri(req.file);
      const uploadFile = await uploader.upload(file.content);
      userImage = uploadFile.secure_url;
    }

    const data = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          image: userImage,
        },
      },
      { new: true }
    );
    res.status(201).json(data);
  } catch (e) {
    console.log(e);
  }
});

// delete user
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(201).json("User deleted");
  } catch (e) {
    console.log(e);
  }
});

// logout user
router.delete("/logout", auth, async (req, res) => {
  try {
    req.headers.authorization = "";
    res.status(201).json("Logout successfully");
  } catch (e) {
    return res.status(401).json(e);
  }
});

export default router;
