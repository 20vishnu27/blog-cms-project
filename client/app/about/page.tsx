"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function About() {
  const [count, setCount] = useState({
    projects: 0,
    experts: 0,
    clients: 0,
    blogs: 0,
    awards: 0,
  });

  // 🔥 COUNTER ANIMATION
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => ({
        projects: prev.projects < 100 ? prev.projects + 2 : 100,
        experts: prev.experts < 15 ? prev.experts + 1 : 15,
        clients: prev.clients < 60 ? prev.clients + 2 : 60,
        blogs: prev.blogs < 30 ? prev.blogs + 1 : 30,
        awards: prev.awards < 25 ? prev.awards + 1 : 25,
      }));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">


        {/* 🔥 SMALL DASHBOARD */}
<nav className="dashNav">
  <h3>📊 About</h3>
  <div>
    <Link href="/">Home</Link>
    <Link href="/contact">Contact Us</Link>
  </div>
</nav>

      {/* HERO */}
      <section className="hero">
        <div className="glass">
          <p className="tag">About Us</p>
          <h1>
            Bringing Your Vision to Life <br />
            with Expertise and Dedication
          </h1>
        </div>
      </section>

      {/* STATS */}
      <section className="stats glass">
        <div><h2>{count.projects}+</h2><p>Projects</p></div>
        <div><h2>{count.experts}+</h2><p>Experts</p></div>
        <div><h2>{count.clients}+</h2><p>Clients</p></div>
        <div><h2>{count.blogs}+</h2><p>Blogs</p></div>
        <div><h2>{count.awards}+</h2><p>Awards</p></div>
      </section>

      {/* STORY */}
      <section className="story">
        <h2>The Blogify Journey Story</h2>
        <p>
          Blogify started with a vision to connect ideas, people, and stories.
          Today, it’s a growing platform trusted by creators worldwide.
        </p>
      </section>

      {/* TEAM */}
      <section className="team">
        <h2>Meet Our Team</h2>

        <div className="teamGrid">
          <div className="member">
            <Image
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="John Doe"
              width={150}
              height={150}
            />
            <h3>John Doe</h3>
            <p>Founder</p>
          </div>

          <div className="member">
            <Image
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Sarah Lee"
              width={150}
              height={150}
            />
            <h3>Sarah Lee</h3>
            <p>Designer</p>
          </div>

          <div className="member">
            <Image
              src="https://randomuser.me/api/portraits/men/65.jpg"
              alt="Mike Ross"
              width={150}
              height={150}
            />
            <h3>Mike Ross</h3>
            <p>Developer</p>
          </div>
        </div>
      </section>

      {/* CSS */}
      <style jsx>{`

.dashNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
}

.dashNav h3 {
  color: #00ffd5;
}

.dashNav div {
  display: flex;
  align-items: center;
  gap: 30px; /* 🔥 perfect spacing */
}

.dashNav a {
  color: #ccc; /* soft premium color */
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  position: relative;
}

/* 🔥 HOVER EFFECT */
.dashNav a:hover {
  color: #00ffd5;
}

/* 🔥 UNDERLINE ANIMATION (INSANE LOOK) */
.dashNav a::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  background: #00ffd5;
  left: 0;
  bottom: -4px;
  transition: 0.3s;
}

.dashNav a:hover::after {
  width: 100%;
}

.dashNav a:hover {
  color: #00ffd5;
}


        .page {
          background: linear-gradient(135deg, #0a0a0a, #111);
          color: white;
          font-family: Arial;
        }

        /* HERO */
      .hero {
  height: 60vh;
  background: linear-gradient(
      rgba(0,0,0,0.3),
      rgba(0,0,0,0.3)
    ),
    url("https://images.unsplash.com/photo-1492724441997-5dc865305da7")
    center/cover no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
}

        /* GLASS */
        .glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          padding: 30px 50px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .tag {
          color: #00ffd5;
          margin-bottom: 10px;
        }

        h1 {
          font-size: 40px;
          line-height: 1.3;
        }

        /* IMAGE */
        .imageWrap {
          display: flex;
          justify-content: center;
          margin-top: -80px;
        }

        .imageWrap img {
          width: 80%;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        /* STATS */
        .stats {
          display: flex;
          justify-content: space-around;
          margin: 40px auto;
          width: 80%;
          padding: 20px;
        }

        .stats div {
          text-align: center;
        }

        .stats h2 {
          color: #00ffd5;
        }

        .stats p {
          color: #aaa;
        }

        /* STORY */
        .story {
          text-align: center;
          max-width: 800px;
          margin: auto;
          padding: 40px;
        }

        .story p {
          color: #aaa;
          line-height: 1.8;
        }

        /* TEAM */
        .team {
          padding: 40px;
          text-align: center;
        }

        .teamGrid {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .member {
          background: #111;
          padding: 20px;
          border-radius: 15px;
          width: 200px;
          transition: 0.3s;
        }

        .member:hover {
          transform: translateY(-8px);
        }

        .member img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }

        .member p {
          color: #aaa;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          h1 {
            font-size: 28px;
          }

          .imageWrap img {
            width: 95%;
          }

          .stats {
            flex-wrap: wrap;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}