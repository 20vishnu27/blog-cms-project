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

//GET BLOG BY ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "name");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json(blog);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// 🟢 GET SINGLE BLOG
export const getBlogs = async (req, res) => {
    try {
        const { keyword, category, tag, page = 1, limit = 5 } = req.query;

        let query = {};

        // 🔍 SEARCH
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { content: { $regex: keyword, $options: "i" } }
            ];
        }

        // 🏷 CATEGORY
        if (category) {
            query.category = category;
        }

        // 🏷 TAGS (multiple supported)
        if (tag) {
            const tagsArray = tag.split(",");
            query.tags = { $in: tagsArray };
        }

        // 📄 PAGINATION LOGIC
        const pageNumber = Number(page);
        const pageSize = Number(limit);

        const skip = (pageNumber - 1) * pageSize;

        // 📊 TOTAL COUNT (IMPORTANT)
        const total = await Blog.countDocuments(query);

        const blogs = await Blog.find(query)
            .populate("author", "name")
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 }); // newest first

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
            count: blogs.length,
            blogs
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
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

//LIKE BLOG
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user.id;

    if (blog.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    blog.likes.push(userId);
    await blog.save();

    res.json({ message: "Blog liked", likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//UNLIKE BLOG
export const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.likes = blog.likes.filter(
      (id) => id.toString() !== req.user.id
    );

    await blog.save();

    res.json({ message: "Blog unliked", likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// CREATE COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = {
      user: req.user.id,
      text,
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({
      message: "Comment added",
      comments: blog.comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GET COMMENT
export const getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "comments.user",
      "name email"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await blog.save();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

