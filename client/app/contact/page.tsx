"use client";

import Link from "next/link";

export default function Contact() {
  return (
    <div className="page">

      {/* 🔥 DASHBOARD (UPDATED CLEAN STYLE) */}
      <nav className="dashNav">
        <h3> Contact Us</h3>

        <div>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <h1>Get In Touch</h1>
          <p>This is your contact page. Let&apos;s connect and build something great.</p>
        </div>
      </section>

      {/* CONTACT CARD */}
      <section className="contactWrapper">

        {/* LEFT FORM */}
        <div className="formBox">
          <h2>Send us a Message</h2>

          <div className="grid">
            <input placeholder="Your Name" />
            <input placeholder="Email Address" />
            <input placeholder="Phone" />
            <input placeholder="Company" />
          </div>

          <textarea placeholder="Write your message..." />

          <button onClick={() => alert("Message Sent Successfully ")}>
  🚀 Send Message
</button>
        </div>

        {/* RIGHT INFO */}
        <div className="infoBox">
          <h2>Contact Info</h2>

          <p>📍 360 King Street, USA</p>
          <p>📞 +91 90000 12345</p>
          <p>✉️ contact@blogify.com</p>

          <div className="socials">
            <span>🌐</span>
            <span>💼</span>
            <span>📸</span>
          </div>
        </div>

      </section>

      {/* FOOTER */}
<footer className="footer">
  <p>© 2026 Blogify | All Rights Reserved</p>
</footer>

      {/* CSS */}
      <style jsx>{`

/* PAGE */
.page {
  background: #f5f7fa;
  min-height: 100vh;
  font-family: Arial;
}

/* DASHBOARD */
.dashNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: #111;
  color: white;
}

.dashNav div {
  display: flex;
  gap: 30px; /* 🔥 spacing */
}

.dashNav a {
  color: #ddd; /* bright clean color */
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s;
}

.dashNav a:hover {
  color: #00ffd5;
}

/* HERO */
.hero {
  height: 40vh;
  background: linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ),
    url("https://images.unsplash.com/photo-1521791136064-7986c2920216")
    center/cover no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.hero h1 {
  font-size: 40px;
}

.hero p {
  margin-top: 10px;
  opacity: 0.9;
}

/* CONTACT WRAPPER */
.contactWrapper {
  display: flex;
  justify-content: center;
  margin-top: -80px;
  padding: 40px;
  gap: 0;
}

/* FORM BOX */
.formBox {
  background: white;
  padding: 30px;
  width: 500px;
  border-radius: 10px 0 0 10px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.formBox h2 {
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

input, textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

textarea {
  width: 100%;
  margin-top: 10px;
  height: 100px;
}

button {
  margin-top: 15px;
  padding: 12px;
  width: 100%;
  border: none;
  background: linear-gradient(45deg, #00ffd5, #007cf0);
  color: black;
  border-radius: 5px;
  cursor: pointer;
}

/* INFO BOX */
.infoBox {
  background: #0a2540;
  color: white;
  padding: 30px;
  width: 300px;
  border-radius: 0 10px 10px 0;
}

.infoBox h2 {
  margin-bottom: 20px;
}

.infoBox p {
  margin: 10px 0;
}

.socials {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  font-size: 20px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .contactWrapper {
    flex-direction: column;
    align-items: center;
  }

  .formBox, .infoBox {
    width: 100%;
    border-radius: 10px;
  }
}

.footer {
  text-align: center;
  padding: 20px;
  background: #111;
  color: #aaa;
  margin-top: 40px;
}

      `}</style>
    </div>
  );
}