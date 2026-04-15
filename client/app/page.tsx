"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
}

interface User {
  role: string;
  email: string;
  name?: string;
}

const BASE_URL = "http://localhost:5000/api/blogs";

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch blogs from Express backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(BASE_URL);
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };

    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Filter by tags
  const filteredBlogs =
    search.trim() === ""
      ? blogs
      : blogs.filter((blog) =>
          blog.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
        );

  return (
    <div className="page">
      <nav className="nav">
        <h2>📝 Blogify</h2>

        <div className="navLinks">
          <Link href="/contact">Contact Us</Link>
          <Link href="/about">About</Link>
          <Link href="/dashboard">Dashboard</Link>

          {user?.role === "admin" && (
            <Link href="/admin" className="adminLink">
              👑 Admin
            </Link>
          )}

          {/* TAG SEARCH */}
          <div className="searchWrapper">
            <span className="searchIcon">🏷️</span>
            <input
              type="text"
              placeholder="Search by tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search"
            />
          </div>

          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="overlay">
          <h1>Welcome to my Blog</h1>
          <p>Sharing ideas, stories & knowledge</p>
          <div className="heroButtons">
            <Link href="/dashboard">
              <button className="heroBtn">✍️ Write a Blog</button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <button className="heroBtn adminHeroBtn">👑 Admin Panel</button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2 className="title">🔥 Latest Blogs</h2>
          {search && (
            <p className="tagFilter">
              Showing results for tag: <span>#{search}</span>
              <button className="clearBtn" onClick={() => setSearch("")}>✕ Clear</button>
            </p>
          )}
        </div>

        <div className="grid">
          {filteredBlogs.map((blog) => (
            <div className="card" key={blog._id}>
              {blog.image && <img src={blog.image} alt="blog" />}

              <div className="cardContent">
                <h3>{blog.title}</h3>
                <p>{blog.content.slice(0, 100)}...</p>

                {/* TAGS */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="tags">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag"
                        onClick={() => setSearch(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link href={`/blog/${blog._id}`}>
                  <button>Read More →</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <p className="noResults">
            {search ? `No blogs found with tag "#${search}" 😕` : "No blogs found 😕"}
          </p>
        )}
      </section>

      <footer className="footer">
        <p>© 2026 Blogify | Built with ❤️</p>
      </footer>

      <style jsx>{`
        .page {
          background: #0a0a0a;
          color: white;
          font-family: Arial;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: black;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navLinks a {
          margin-left: 25px;
          cursor: pointer;
          transition: 0.3s;
          text-decoration: none;
          color: #ccc;
          font-weight: 500;
        }

        .navLinks a:hover {
          color: #00ffd5;
        }

        .adminLink {
          color: gold !important;
        }

        .adminLink:hover {
          color: orange !important;
        }

        /* TAG SEARCH */
        .searchWrapper {
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 6px 12px;
          margin-left: 20px;
          gap: 6px;
        }

        .searchIcon {
          font-size: 14px;
        }

        .search {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 14px;
          width: 150px;
        }

        .search::placeholder {
          color: #666;
        }

        .logoutBtn {
          margin-left: 15px;
          padding: 6px 14px;
          background: #ef4444;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }

        .logoutBtn:hover {
          background: #dc2626;
        }

        .hero {
          height: 80vh;
          background: url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")
            center/cover no-repeat;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .overlay {
          background: rgba(0, 0, 0, 0.6);
          padding: 30px 60px;
          border-radius: 20px;
          text-align: center;
        }

        .overlay h1 {
          font-size: 48px;
        }

        .overlay p {
          margin-top: 10px;
          color: #ccc;
        }

        .heroButtons {
          margin-top: 20px;
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .heroBtn {
          padding: 12px 24px;
          border: none;
          background: linear-gradient(45deg, #00ffd5, #007cf0);
          color: black;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
        }

        .adminHeroBtn {
          background: linear-gradient(45deg, #f59e0b, #ef4444);
          color: white;
        }

        .section {
          padding: 40px;
        }

        .sectionHeader {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .title {
          margin: 0;
        }

        .tagFilter {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tagFilter span {
          color: #00ffd5;
          font-weight: bold;
        }

        .clearBtn {
          background: transparent;
          border: 1px solid #555;
          color: #aaa;
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin: 0;
        }

        .clearBtn:hover {
          background: #333;
          color: white;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .card {
          background: #111;
          border-radius: 15px;
          overflow: hidden;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .cardContent {
          padding: 15px;
        }

        .cardContent h3 {
          margin-bottom: 10px;
        }

        .cardContent p {
          color: #aaa;
        }

        /* TAGS */
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .tag {
          background: #1e293b;
          color: #00ffd5;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: 0.2s;
          border: 1px solid #00ffd5;
        }

        .tag:hover {
          background: #00ffd5;
          color: black;
        }

        button {
          margin-top: 10px;
          padding: 10px;
          border: none;
          background: linear-gradient(45deg, #00ffd5, #007cf0);
          color: black;
          border-radius: 5px;
          cursor: pointer;
        }

        .noResults {
          text-align: center;
          color: #aaa;
          margin-top: 40px;
          font-size: 18px;
        }

        .footer {
          text-align: center;
          padding: 20px;
          background: black;
          margin-top: 40px;
        }
      `}</style>
    </div>
  );
}