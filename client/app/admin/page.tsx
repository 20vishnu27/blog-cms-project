'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

//////////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////////

type Blog = {
  _id: string;
  title: string;
  content: string;
  status?: string;      // 'published' | 'draft'
  likes?: string[];
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

//////////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////////

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #F7F5F0;
    --surface:   #FFFFFF;
    --border:    #E8E3DC;
    --text:      #1A1714;
    --muted:     #8A8279;
    --accent:    #C2692A;
    --accent-lt: #F5EDE4;
    --green:     #2E7D5A;
    --green-lt:  #E4F2EC;
    --amber:     #B07D2B;
    --amber-lt:  #FBF4E3;
    --purple:    #5B4DAB;
    --purple-lt: #EEE9F8;
    --danger:    #C0392B;
    --danger-lt: #FDECEA;
    --radius:    10px;
    --shadow:    0 2px 12px rgba(26,23,20,0.07);
    --shadow-lg: 0 8px 32px rgba(26,23,20,0.12);
    font-family: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); min-height: 100vh; }

  /* ── Login ── */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    background-image:
      radial-gradient(circle at 20% 20%, #F0E6D8 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, #E6EFF4 0%, transparent 50%);
  }

  .login-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    width: 380px;
    box-shadow: var(--shadow-lg);
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    justify-content: center;
  }

  .login-logo svg { color: var(--accent); }

  .login-title {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--text);
  }

  .login-subtitle {
    font-size: 13px;
    color: var(--muted);
    text-align: center;
    margin-top: 4px;
    margin-bottom: 28px;
    letter-spacing: 0.02em;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .field-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
    margin-bottom: 16px;
  }
  .field-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-lt);
    background: var(--surface);
  }

  .btn-primary {
    width: 100%;
    padding: 11px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.02em;
    margin-top: 4px;
  }
  .btn-primary:hover { background: #A8561F; }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .error-msg {
    background: var(--danger-lt);
    color: var(--danger);
    border: 1px solid #F5C6C2;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  /* ── Dashboard shell ── */
  .dash-shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  /* ── Header ── */
  .dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1.5px solid var(--border);
  }

  .dash-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dash-brand svg { color: var(--accent); }

  .dash-brand-text {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
  }

  .dash-brand-badge {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--accent-lt);
    color: var(--accent);
    padding: 2px 8px;
    border-radius: 20px;
  }

  .btn-logout {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-logout:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-lt); }

  /* ── Stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    box-shadow: var(--shadow);
  }

  .stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .stat-value {
    font-family: 'Lora', serif;
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }

  .stat-card.blue   .stat-value { color: #2563EB; }
  .stat-card.green  .stat-value { color: var(--green); }
  .stat-card.amber  .stat-value { color: var(--amber); }
  .stat-card.purple .stat-value { color: var(--purple); }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .tab-btn {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
  }

  .tab-btn.active {
    background: var(--text);
    color: #fff;
    border-color: var(--text);
  }

  .tab-btn.inactive {
    background: var(--surface);
    color: var(--muted);
    border-color: var(--border);
  }
  .tab-btn.inactive:hover { border-color: var(--text); color: var(--text); }

  .btn-new {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-new:hover { background: #A8561F; }
  .btn-new.cancel { background: var(--surface); color: var(--muted); border: 1.5px solid var(--border); }
  .btn-new.cancel:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-lt); }

  /* ── Blog Form ── */
  .form-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: var(--shadow);
  }

  .form-card h3 {
    font-family: 'Lora', serif;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text);
  }

  .form-card .field-input { background: var(--bg); }
  .form-card textarea.field-input {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  .form-actions { display: flex; gap: 10px; margin-top: 4px; }

  .btn-save {
    padding: 9px 20px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-save:hover { background: #A8561F; }

  .btn-cancel-form {
    padding: 9px 20px;
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-cancel-form:hover { border-color: var(--danger); color: var(--danger); }

  /* ── Blog cards ── */
  .blog-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
    margin-bottom: 12px;
    box-shadow: var(--shadow);
    transition: box-shadow 0.15s, border-color 0.15s;
  }
  .blog-card:hover { box-shadow: var(--shadow-lg); border-color: #D4CDC4; }

  .blog-card-title {
    font-family: 'Lora', serif;
    font-size: 17px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 6px;
  }

  .blog-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .meta-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .meta-tag.published { background: var(--green-lt);  color: var(--green); }
  .meta-tag.draft     { background: var(--amber-lt);  color: var(--amber); }
  .meta-tag.likes     { background: var(--purple-lt); color: var(--purple); }

  .blog-card-excerpt {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 14px;
  }

  .blog-card-actions { display: flex; gap: 8px; }

  .btn-edit {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 14px;
    background: #EFF6FF;
    color: #2563EB;
    border: 1.5px solid #BFDBFE;
    border-radius: 7px;
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-edit:hover { background: #DBEAFE; border-color: #93C5FD; }

  .btn-delete {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 14px;
    background: var(--danger-lt);
    color: var(--danger);
    border: 1.5px solid #F5C6C2;
    border-radius: 7px;
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-delete:hover { background: #FAD7D3; }

  /* ── User rows ── */
  .user-row {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow);
    transition: box-shadow 0.15s;
  }
  .user-row:hover { box-shadow: var(--shadow-lg); }

  .user-info { display: flex; align-items: center; gap: 12px; }

  .user-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--accent-lt);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 15px; font-family: 'Lora', serif;
    flex-shrink: 0;
  }

  .user-name  { font-size: 14px; font-weight: 600; color: var(--text); }
  .user-email { font-size: 12px; color: var(--muted); margin-top: 1px; }

  .role-badge {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .role-badge.admin { background: var(--accent-lt); color: var(--accent); }
  .role-badge.user  { background: var(--green-lt);  color: var(--green); }

  .user-controls { display: flex; align-items: center; gap: 10px; }

  .role-select {
    padding: 6px 10px;
    border: 1.5px solid var(--border);
    border-radius: 7px;
    background: var(--bg);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
  }
  .role-select:focus { border-color: var(--accent); }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
    font-size: 14px;
  }
  .empty-state svg { margin: 0 auto 12px; display: block; opacity: 0.35; }
`;

//////////////////////////////////////////////////////////
// MAIN PAGE
//////////////////////////////////////////////////////////

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const user = localStorage.getItem('user');
    if (!user) return false;
    try {
      const parsed = JSON.parse(user);
      return parsed.role === 'admin';
    } catch {
      return false;
    }
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {isAdmin ? (
        <Dashboard onLogout={() => { localStorage.clear(); window.location.href = '/'; }} />
      ) : (
        <Login onLogin={() => setIsAdmin(true)} />
      )}
    </>
  );
}

//////////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////////

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // POST /api/auth/login
      const res = await axios.post(`${API}/auth/login`, { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin();
      } else {
        setError('Login failed');
      }
    } catch {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="login-title">CMS Admin</span>
        </div>
        <p className="login-subtitle">Sign in to manage your content</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="field-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////
// DASHBOARD
//////////////////////////////////////////////////////////

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [activeTab, setActiveTab] = useState<'blogs' | 'users'>('blogs');
  const [showForm, setShowForm]   = useState(false);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── stats derived from data — no separate /admin/stats endpoint needed ──
  const totalBlogs     = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;
  const draftBlogs     = blogs.filter((b) => b.status === 'draft').length;
  const totalUsers     = users.length;

  // ── auth header helper ──
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  // ── data fetch — useCallback keeps the ref stable for useEffect ──
  const reloadData = useCallback(async () => {
    try {
      const headers = authHeaders();
      const [blogsRes, usersRes] = await Promise.all([
        axios.get(`${API}/blogs`, { headers }),          // GET /api/blogs
        axios.get(`${API}/users`, { headers }),          // GET /api/users  (adminOnly)
      ]);
      setBlogs(blogsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // ── blog handlers ──

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = authHeaders();
    try {
      if (editingId) {
        await axios.put(`${API}/blogs/${editingId}`, { title, content }, { headers });   // PUT /api/blogs/:id
      } else {
        await axios.post(`${API}/blogs`, { title, content }, { headers });               // POST /api/blogs
      }
      setTitle(''); setContent(''); setEditingId(null); setShowForm(false);
      reloadData();
    } catch {
      alert('Error saving blog');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    await axios.delete(`${API}/blogs/admin/blog/${id}`, { headers: authHeaders() });    // DELETE /api/blogs/admin/blog/:id
    reloadData();
  };

  const handleEdit = (blog: Blog) => {
    setTitle(blog.title); setContent(blog.content);
    setEditingId(blog._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── user handlers ──

  const handleRoleChange = async (userId: string, role: string) => {
    await axios.put(                                                                      // PUT /api/users/:id/role
      `${API}/users/${userId}/role`, { role },
      { headers: authHeaders() }
    );
    reloadData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete user?')) return;
    await axios.delete(`${API}/users/${userId}`, { headers: authHeaders() });            // DELETE /api/users/:id
    reloadData();
  };

  // ── render ──

  return (
    <div className="dash-shell">

      {/* HEADER */}
      <header className="dash-header">
        <div className="dash-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="dash-brand-text">CMS Admin</span>
          <span className="dash-brand-badge">Dashboard</span>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </header>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Blogs</div>
          <div className="stat-value">{totalBlogs}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Published</div>
          <div className="stat-value">{publishedBlogs}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Drafts</div>
          <div className="stat-value">{draftBlogs}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Users</div>
          <div className="stat-value">{totalUsers}</div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <button
          className={`tab-btn ${activeTab === 'blogs' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        {activeTab === 'blogs' && (
          <button
            className={`btn-new ${showForm ? 'cancel' : ''}`}
            onClick={() => {
              if (showForm) { setTitle(''); setContent(''); setEditingId(null); }
              setShowForm(!showForm);
            }}
          >
            {showForm ? '✕ Cancel' : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Blog
              </>
            )}
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && activeTab === 'blogs' && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Blog Post' : 'New Blog Post'}</h3>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              className="field-input"
              placeholder="Enter a compelling title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label className="field-label" htmlFor="blog-content">Content</label>
            <textarea
              id="blog-content"
              className="field-input"
              placeholder="Write your content here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingId ? 'Update Post' : 'Publish Post'}
              </button>
              <button
                type="button"
                className="btn-cancel-form"
                onClick={() => { setTitle(''); setContent(''); setEditingId(null); setShowForm(false); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BLOGS */}
      {activeTab === 'blogs' && (
        blogs.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            No blog posts yet. Create your first one!
          </div>
        ) : (
          blogs.map((b) => (
            <div key={b._id} className="blog-card">
              <div className="blog-card-title">{b.title}</div>
              <div className="blog-card-meta">
                {b.status && (
                  <span className={`meta-tag ${b.status}`}>{b.status}</span>
                )}
                {b.likes !== undefined && (
                  <span className="meta-tag likes">♥ {b.likes.length} likes</span>
                )}
              </div>
              <div className="blog-card-excerpt">{b.content.slice(0, 120)}…</div>
              <div className="blog-card-actions">
                <button className="btn-edit" onClick={() => handleEdit(b)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(b._id)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        users.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            No users found.
          </div>
        ) : (
          users.map((u) => (
            <div key={u._id} className="user-row">
              <div className="user-info">
                <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="user-name">{u.name}</div>
                  <div className="user-email">{u.email}</div>
                </div>
                <span className={`role-badge ${u.role}`}>{u.role}</span>
              </div>
              <div className="user-controls">
                <select
                  className="role-select"
                  value={u.role}
                  aria-label={`Change role for ${u.name}`}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {u.role !== 'admin' && (
                  <button className="btn-delete" onClick={() => handleDeleteUser(u._id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )
      )}

    </div>
  );
}
