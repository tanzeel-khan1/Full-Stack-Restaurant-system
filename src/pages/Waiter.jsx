import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Graph from "./Graph";

const Waiter = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181C14] via-[#1f241a] to-black">
      
      {/* 🔝 Navbar */}
      <nav className="w-full bg-[#111] border-b border-amber-500/30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo / Title */}
          <h1 className="text-xl font-bold text-amber-400">
            My Dashboard
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => navigate("/waiter/attendance")}
              className="px-4 py-2 rounded-lg  cursor-pointer bg-amber-500 text-black font-medium hover:bg-amber-400 transition"
            >
              Attendance
            </button>

            <button
              onClick={() => navigate("/waiter/leave")}
              className="px-4 py-2 rounded-lg cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-400 transition"
            >
              Leave
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg cursor-pointer bg-red-500 text-white font-medium hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-amber-400 focus:outline-none"
            >
              {menuOpen ? "✖️" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate("/waiter/attendance");
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition"
            >
              Attendance
            </button>

            <button
              onClick={() => {
                navigate("/waiter/leave");
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-400 transition"
            >
              Leave
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* 🧱 Page Content */}
      <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4 text-center">
        <div className="text-gray-300">
         
        </div>
        <Graph/>
      </div>

    </div>
  );
};

export default Waiter;
