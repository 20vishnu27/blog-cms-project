"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BASE_URL = "http://localhost:5000/api/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed ❌");
        return;
      }

      alert("Signup successful ✅");
      router.push("/login");
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Sign Up</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />

      <br />

      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}