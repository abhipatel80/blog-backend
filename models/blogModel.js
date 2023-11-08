import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [10, "title must be atleast 10 characters"],
      maxlength: [40, "title not be greater than 40 characters"],
    },
    description: {
      type: String,
      required: true,
      minlength: [50, "description must be atleast 50 characters"],
      maxlength: [2000, "description not be greater than 2000 characters"],
    },
    blogImage: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    totalComments: { type: Number },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blog", blogSchema);

export default blogModel;
