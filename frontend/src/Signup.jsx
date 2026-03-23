import React, { useState } from "react";
import axios from "axios";

const Signup = ({ setShowLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "male",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5001/api/auth/signup", form);
      alert("✅ Signup successful!");
      setShowLogin(true);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">

      <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 shadow-lg">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {/* Inputs */}
        <div className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Age / Height / Weight */}
          <div className="grid grid-cols-3 gap-3">
            <input
              name="age"
              placeholder="Age"
              onChange={handleChange}
              className="p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none"
            />

            <input
              name="height"
              placeholder="Height"
              onChange={handleChange}
              className="p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none"
            />

            <input
              name="weight"
              placeholder="Weight"
              onChange={handleChange}
              className="p-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 outline-none"
            />
          </div>

          <select
            name="gender"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none"
          >
            <option value="male" className="text-black">Male</option>
            <option value="female" className="text-black">Female</option>
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
        >
          Signup
        </button>

        {/* Switch */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer font-semibold hover:underline"
            onClick={() => setShowLogin(true)}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;