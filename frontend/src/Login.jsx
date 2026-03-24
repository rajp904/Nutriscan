import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUserId, setShowLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://nutriscan-god0.onrender.com/api/auth/login",
        { email, password }
      );

      const userId = res.data.user.id;
      localStorage.setItem("userId", userId);
      setUserId(userId);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">

      <div className="w-full max-w-sm p-6 rounded-2xl bg-zinc-900 shadow-lg">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Inputs */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
        >
          Login
        </button>

        {/* Switch */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer font-semibold hover:underline"
            onClick={() => setShowLogin(false)}
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;