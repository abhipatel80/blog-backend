import dotenv from 'dotenv'
dotenv.config('.env');

import express from 'express';
const app = express();
import dbConnection from './db.js';
import blog from './routes/blogRoute.js';
import user from './routes/userRoute.js';
import cors from 'cors';
const port = process.env.PORT || 8000;

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(cors({ origin: "https://blogify-me.vercel.app", credentials: true }));
app.use("/blog", blog);
app.use("/user", user);

app.listen(port, () => {
    console.log(`Application Listening on port ${port}`);
});
