import dotenv from 'dotenv'
dotenv.config('.env');

import express from 'express';
import dbConnection from './db.js';
import blog from './routes/blogRoute.js';
import user from './routes/userRoute.js';
import path from 'path';
import cors from 'cors';
// import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cloudinaryConfig } from './utils/cloudinaryConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 8000;

const app = express();
app.use('*', cloudinaryConfig);
dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());

app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.use('/userImages', express.static(path.join(__dirname, 'public/userImages')));

// app.use(cors({ origin: "https://blogify-me.vercel.app", credentials: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/blog", blog);
app.use("/user", user);

app.listen(port, () => {
    console.log(`Application Listening on port ${port}`);
}); 
