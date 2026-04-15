"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const BASE_URL = "http://localhost:5000/api/blogs";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"create" | "myblogs">("create");
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchMyBlogs();
  }, []);

  // Fetch only the logged-in user's blogs
  const fetchMyBlogs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/me`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      await fetch(BASE_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
      });

      alert("Blog Created ✅");
      setTitle("");
      setContent("");
      fetchMyBlogs();
      setActiveTab("myblogs");
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="container">

      {/* TOP NAV */}
      <nav className="navbar">
        <Link href="/" className="backBtn">← Home</Link>
        <h1 className="logo">📝 Blog CMS</h1>
        <button className="logoutBtn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="layout">

        {/* LEFT SIDEBAR — USER PROFILE */}
        <aside className="sidebar">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <h2 className="userName">{user?.name ?? "User"}</h2>
          <p className="userEmail">{user?.email ?? ""}</p>

          <div className="stats">
            <div className="stat">
              <span className="statNum">{blogs.length}</span>
              <span className="statLabel">Blogs</span>
            </div>
          </div>

          <div className="sidebarNav">
            <button
              className={`sideBtn ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              ✏️ Create Blog
            </button>
            <button
              className={`sideBtn ${activeTab === "myblogs" ? "active" : ""}`}
              onClick={() => setActiveTab("myblogs")}
            >
              📚 My Blogs
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">

          {/* CREATE BLOG TAB */}
          {activeTab === "create" && (
            <div className="formCard">
              <h2>Create New Blog</h2>
              <form onSubmit={handleSubmit}>
                <input
                  className="input"
                  placeholder="Enter blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="textarea"
                  placeholder="Write your content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button className="btn" type="submit">Publish</button>
              </form>
            </div>
          )}

          {/* MY BLOGS TAB */}
          {activeTab === "myblogs" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>My Blogs</h2>

              {blogs.length === 0 ? (
                <div className="emptyState">
                  <p>No blogs yet.</p>
                  <button className="btn" onClick={() => setActiveTab("create")}>
                    Write your first blog →
                  </button>
                </div>
              ) : (
                <div className="blogGrid">
                  {blogs.map((b) => (
                    <div key={b._id} className="blogCard">
                      <h3>{b.title}</h3>
                      <p>{b.content.slice(0, 120)}...</p>
                      {b.createdAt && (
                        <span className="date">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      )}
                      <div className="cardActions">
                        <Link href={`/blog/${b._id}`} className="viewBtn">View</Link>
                        <button
                          className="deleteBtn"
                          onClick={() => handleDelete(b._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }

        .container {
          background: #0f172a;
          min-height: 100vh;
          color: white;
          font-family: Arial;
        }

        /* NAVBAR */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 30px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .backBtn {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .backBtn:hover { color: white; }

        .logo {
          font-size: 20px;
          margin: 0;
        }

        .logoutBtn {
          background: #ef4444;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .logoutBtn:hover { background: #dc2626; }

        /* LAYOUT */
        .layout {
          display: flex;
          gap: 0;
          min-height: calc(100vh - 60px);
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px;
          background: #1e293b;
          padding: 30px 20px;
          border-right: 1px solid #334155;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #7b61ff, #5ac8fa);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .userName {
          margin: 0 0 5px;
          font-size: 18px;
        }

        .userEmail {
          color: #94a3b8;
          font-size: 13px;
          margin: 0 0 20px;
          text-align: center;
          word-break: break-all;
        }

        .stats {
          display: flex;
          gap: 20px;
          background: #0f172a;
          padding: 12px 24px;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .statNum {
          font-size: 22px;
          font-weight: bold;
          color: #22c55e;
        }

        .statLabel {
          font-size: 12px;
          color: #94a3b8;
        }

        .sidebarNav {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sideBtn {
          width: 100%;
          padding: 10px 15px;
          background: transparent;
          border: 1px solid #334155;
          color: #94a3b8;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          transition: all 0.2s;
        }

        .sideBtn:hover, .sideBtn.active {
          background: #334155;
          color: white;
          border-color: #7b61ff;
        }

        /* MAIN */
        .main {
          flex: 1;
          padding: 30px;
        }

        .formCard {
          background: #1e293b;
          padding: 25px;
          border-radius: 12px;
          max-width: 600px;
        }

        .formCard h2 { margin-top: 0; margin-bottom: 20px; }

        .input, .textarea {
          width: 100%;
          padding: 12px;
          margin-top: 12px;
          border-radius: 8px;
          border: 1px solid #334155;
          background: #0f172a;
          color: white;
          outline: none;
          font-size: 14px;
        }

        .textarea { height: 120px; resize: vertical; }

        .btn {
          margin-top: 15px;
          width: 100%;
          padding: 12px;
          background: #22c55e;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          font-size: 15px;
        }

        .btn:hover { background: #16a34a; }

        /* BLOG GRID */
        .blogGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .blogCard {
          background: #1e293b;
          padding: 18px;
          border-radius: 12px;
          border: 1px solid #334155;
          transition: 0.2s;
        }

        .blogCard:hover {
          border-color: #7b61ff;
          transform: translateY(-2px);
        }

        .blogCard h3 { margin: 0 0 10px; color: #22c55e; }
        .blogCard p  { color: #94a3b8; font-size: 14px; margin: 0 0 10px; }

        .date {
          font-size: 12px;
          color: #64748b;
          display: block;
          margin-bottom: 12px;
        }

        .cardActions {
          display: flex;
          gap: 10px;
        }

        .viewBtn {
          padding: 6px 14px;
          background: #3b82f6;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
        }

        .deleteBtn {
          padding: 6px 14px;
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .deleteBtn:hover { background: #ef4444; color: white; }

        .emptyState {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .emptyState .btn { width: auto; display: inline-block; }
      `}</style>
    </div>
  );
}