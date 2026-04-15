"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:5000/api/auth";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed ❌");
        return;
      }

      alert("Signup successful ✅");
      setIsSignup(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid credentials ❌");
        return;
      }

      // Store the JWT token returned by your backend
      localStorage.setItem("token", data.token);

      // Optionally store basic user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/");
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="container">
      <div className="card">

        {/* LEFT IMAGE PANEL */}
        <div className="left">
          <div className="overlay">
            <h2>Capturing Moments, Creating Memories</h2>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="right">
          <h2>{isSignup ? "Create an account" : "Welcome Back"}</h2>

          {isSignup && (
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={isSignup ? handleSignup : handleLogin}>
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="switch">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? " Login" : " Sign Up"}
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #e5e7eb;
        }

        .card {
          width: 850px;
          height: 450px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          background: #1e1e2f;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        /* LEFT SIDE IMAGE */
        .left {
          width: 50%;
          background: url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")
            center/cover no-repeat;
          position: relative;
        }

        .overlay {
          position: absolute;
          bottom: 30px;
          left: 20px;
          right: 20px;
          color: white;
          font-size: 18px;
        }

        /* RIGHT SIDE FORM */
        .right {
          width: 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #2a2a3d;
          color: white;
        }

        .right h2 {
          margin-bottom: 20px;
        }

        .right input {
          margin: 10px 0;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: #3a3a4d;
          color: white;
        }

        .right input::placeholder {
          color: #bbb;
        }

        .right button {
          margin-top: 15px;
          padding: 12px;
          background: linear-gradient(45deg, #7b61ff, #5ac8fa);
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .switch {
          margin-top: 15px;
          font-size: 14px;
          color: #ccc;
        }

        .switch span {
          color: #7b61ff;
          cursor: pointer;
          margin-left: 5px;
        }
      `}</style>
    </div>
  );
}