import Blog from "../models/Blog.js";

// 🟢 CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, image, tags, category } = req.body;

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      image,
      tags,
      category,
      author: req.user.id // from JWT middleware
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 GET ALL BLOGS
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 GET SINGLE BLOG
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name");

    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 UPDATE BLOG
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 DELETE BLOG
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    await blog.deleteOne();

    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};