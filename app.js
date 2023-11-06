import dotenv from "dotenv";
dotenv.config(".env");

import express from "express";
import dbConnection from "./db.js";
import blog from "./routes/blogRoute.js";
import user from "./routes/userRoute.js";
import cors from "cors";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

const port = process.env.PORT || 8000;

const app = express();
app.use("*", cloudinaryConfig);
dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: "https://blogify-me.vercel.app", credentials: true }));

app.use("/blog", blog);
app.use("/user", user);

app.listen(port, () => {
  console.log(`Application Listening on port ${port}`);
});
