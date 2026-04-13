import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    excerpt: {
      type: String
    },

    image: {
      type: String // URL of image
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tags: [
      {
        type: String
      }
    ],

    category: {
      type: String,
      default: "General"
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;