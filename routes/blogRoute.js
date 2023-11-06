import express from 'express';
const router = express();
import blogModel from '../models/blogModel.js';
import { auth } from '../middleware/auth.js';
import upload from '../utils/upload.js';
import fs from 'fs';

// create new blog
router.post("/add", auth, upload.single("file"), async (req, res) => {
    try {
        let blogImage;
        if(req?.file){
            blogImage = req?.file?.filename;
        }
        const { title, description } = req.body;
        if (!title || !description || !blogImage) {
            return res.status(400).json("Please fill all data");
        };
        if (title.split("").length < 10) {
            return res.status(401).json("title must be atleast 10 characters");
        }
        if (description.split("").length < 50) {
            return res.status(401).json("description must be atleast 50 characters");
        }
        if (title.split("").length > 40) {
            return res.status(401).json("title not be greater than 40 characters");
        }
        if (description.split("").length > 2000) {
            return res.status(401).json("description not be greater than 2000 characters");
        }
        const data = await blogModel.create({
            title,
            description,
            blogImage: "/files/" + blogImage,
            userId: req.user._id,
            userName: req.user.name
        });
        return res.status(201).json(data);
    } catch (e) {
        console.log(e.message);
        return res.status(401).json(e);
    }
});

// add comment to blog
router.put('/comment', auth, async (req, res) => {
    try {
        const { comment, blogId } = req.body;
        const data = {
            userId: req.user._id,
            name: req.user.name,
            comment,
        };

        let blog = await blogModel.findById(blogId);

        const isCommented = blog.comments.find(val => val.userId.toString() === req.user._id.toString());
        if (!comment || !blogId) {
            return res.status(401).json("Please fill all data");
        } else if (isCommented) {
            blog.comments.forEach((val) => {
                if (val.userId.toString() === req.user._id.toString()) {
                    val.comment = comment;
                };
            });
            await blog.save();
            res.status(201).json("Blog commented successfully");
        } else {
            blog.comments.push(data);
            blog.totalComments = blog.comments.length;
            await blog.save();
            res.status(201).json("Blog commented successfully");
        }

    } catch (e) {
        return res.status(401).json(e);
    }
});

// delete comment to blog
router.delete('/comment', auth, async (req, res) => {
    try {
        const blog = await blogModel.findById(req.query.blogId);
        if (!blog) {
            return res.status(404).json("Blog not found");
        };

        const comments = blog.comments.filter((val) => {
            return val._id.toString() !== req.query.id.toString();
        });

        const totalComments = comments.length;

        await blogModel.findByIdAndUpdate(req.query.blogId, { comments, totalComments }, { new: true });

        res.status(201).json("Blog comment deleted successfully");

    } catch (e) {
        return res.status(401).json(e);
    }
});

// get my blogs 
router.get("/get/me/:id", auth, async (req, res) => {
    try {
        const blog = await blogModel.find({ userId: req.params.id });
        return res.status(201).json(blog);
    } catch (e) {
        return res.status(401).json(e);
    }
})

// get all blogs
router.get("/get", async (req, res) => {
    try {
        if (req.query.name) {
            const search = await blogModel.find({ title: { $regex: req.query.name, $options: "i" } });
            return res.status(201).json(search);
        }
        const data = await blogModel.find();
        res.status(201).json(data);
    } catch (e) {
        console.log(e);
    }
});

// get single blog
router.get("/get/:id", async (req, res) => {
    try {
        const data = await blogModel.findById(req.params.id);
        res.status(201).json(data);
    } catch (e) {
        console.log(e);
    }
});

// edit blog  
router.put("/edit/:id", auth, upload.single("file"), async (req, res) => {
    try {

        let blogImage;
        if(req?.file){
            blogImage = req?.file?.filename;
        }

        const oldBlog = await blogModel.findById(req.params.id);

        const data = await blogModel.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                blogImage: "/files/" + blogImage,
            }
        }, { new: true });

        fs.unlink("E:/Encircle technology/9projects/blog app/backend/public" + oldBlog.blogImage, (err) => {
            if (err) return console.log(err);
            console.log('blogimage deleted successfully');
        });
        res.status(201).json(data);
    } catch (e) {
        console.log(e);
    }
});

// delete blog
router.delete("/delete/:id/:userId", auth, async (req, res) => {
    try {
        await blogModel.findOneAndDelete({ _id: req.params.id, userId: req.params.userId });
        res.status(201).json("Blog deleted successfully");
    } catch (e) {
        console.log(e);
    }
});

export default router;
