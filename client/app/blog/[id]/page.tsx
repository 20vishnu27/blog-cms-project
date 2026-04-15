"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function BlogDetail() {
  const { id } = useParams();

  // ✅ STATES
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<{ _id: string; text: string; user?: { name: string } }[]>([]);
  const [input, setInput] = useState("");
  const [blog, setBlog] = useState<{ title: string; content: string; image?: string } | null>(null);

  // ✅ AUTH HELPER
  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ✅ LOGIN PROTECTION
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/auth/login";
    }
  }, []);

  // ✅ FETCH BLOG DATA — GET /api/blogs/:id
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API}/blogs/${id}`);
        setBlog(res.data);
        setLikes(res.data.likes?.length ?? 0);

        // check if current user already liked
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (res.data.likes?.includes(user._id)) {
          setLiked(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // ✅ FETCH COMMENTS — GET /api/blogs/:id/comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API}/blogs/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchComments();
  }, [id]);

  // ✅ LIKE — PUT /api/blogs/:id/like
  // ✅ UNLIKE — PUT /api/blogs/:id/unlike
  const handleLike = async () => {
    try {
      if (liked) {
        await axios.put(`${API}/blogs/${id}/unlike`, {}, { headers: authHeaders() });
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        await axios.put(`${API}/blogs/${id}/like`, {}, { headers: authHeaders() });
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD COMMENT — POST /api/blogs/:id/comment
  const handleAddComment = async () => {
    if (input.trim() === "") return;
    try {
      const res = await axios.post(
        `${API}/blogs/${id}/comment`,
        { text: input },
        { headers: authHeaders() }
      );
      setComments(res.data);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE COMMENT — DELETE /api/blogs/:id/comment/:commentId
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await axios.delete(
        `${API}/blogs/${id}/comment/${commentId}`,
        { headers: authHeaders() }
      );
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">

      {/* HERO IMAGE */}
      <div
        className="hero"
        style={{
          background: blog?.image
            ? `url(${blog.image}) center/cover no-repeat`
            : "#1a1a1a",
        }}
      >
        <h1>{blog?.title}</h1>
      </div>

      {/* CONTENT */}
      <div className="content">
        <p>{blog?.content}</p>

        {/* LIKE BUTTON */}
        <div className="actions">
          <button onClick={handleLike}>
            {liked ? "💔 Unlike" : "❤️ Like"} ({likes})
          </button>
        </div>

        {/* COMMENT INPUT */}
        <div className="commentBox">
          <input
            type="text"
            placeholder="Write a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>

        {/* COMMENTS */}
        <div className="comments">
          {comments.map((c) => (
            <p key={c._id}>
              💬 {c.user?.name ? <strong>{c.user.name}: </strong> : null}
              {c.text}
              <button
                onClick={() => handleDeleteComment(c._id)}
                style={{
                  marginLeft: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#ff4444",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ✕
              </button>
            </p>
          ))}
        </div>

        {/* RELATED BLOGS */}
        <div style={{ marginTop: "40px" }}>
          <h2>🔥 Related Blogs</h2>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            {[1, 2, 3, 4, 5, 6]
              .filter((b) => b.toString() !== id)
              .slice(0, 3)
              .map((b) => (
                <Link key={b} href={`/blog/${b}`}>
                  <div
                    style={{
                      background: "#111",
                      padding: "15px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Blog #{b}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .page {
          background: #0a0a0a;
          color: white;
        }

        .hero {
          height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero h1 {
          background: rgba(0,0,0,0.6);
          padding: 20px 40px;
          border-radius: 10px;
          font-size: 40px;
        }

        .content {
          max-width: 800px;
          margin: auto;
          padding: 30px;
        }

        .actions button {
          padding: 10px;
          border: none;
          background: #00ffd5;
          color: black;
          border-radius: 5px;
          cursor: pointer;
        }

        .commentBox {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .commentBox input {
          flex: 1;
          padding: 10px;
          border-radius: 5px;
          border: none;
        }

        .commentBox button {
          padding: 10px;
          background: #007cf0;
          border: none;
          color: white;
          border-radius: 5px;
        }

        .comments {
          margin-top: 20px;
        }

        .comments p {
          background: #111;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}