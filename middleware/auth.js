import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json("Token not provided");
    } else {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json("Please login to access this resource");
      } else {
        const userId = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findById(userId._id);
        req.user = user;
      }
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "Invalid token signature" });
  }
};
