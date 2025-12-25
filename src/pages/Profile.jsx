import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import GetOrderbyuserid from "../components/GetOrderbyuserid";
import GetTablebyuserid from "../components/GetTablebyuserid";
const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (user) {
      logout();
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#181C14]">
      <div className="w-full bg-[#181C14] flex flex-col md:flex-row items-center  justify-between px-6 md:px-12 py-6">
        <div className="w-full md:w-[40%] flex justify-start md:justify-start mb-8 md:mb-0 ">
          <Link
            to="/"
            className="flex items-center gap-2 w-fit bg-transparent border border-amber-400 
             rounded-md px-3 py-2 cursor-pointer text-amber-400 text-sm md:text-base 
             shadow-md transition-all duration-300 ease-in-out
             hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
          >
            <FaLongArrowAltLeft />
            <span>Go Back</span>
          </Link>
        </div>

        <div className="w-full md:w-[60%] flex flex-col md:flex-row items-center justify-between shadow-orange-400 bg-slate-800/40 rounded-xl shadow-lg px-6 py-4">
          <h1 className="text-amber-400 text-lg md:text-2xl font-bold tracking-wide text-center md:text-left mb-3 md:mb-0">
            {user ? ` Hi! Welcome, ${user.name}` : "Hi! Welcome, Guest"}
          </h1>

          <button
            onClick={handleAuth}
            className="px-5 py-2 bg-amber-400 text-[#1a1a1a] font-semibold rounded-md cursor-pointer shadow-md 
           hover:bg-amber-500 hover:scale-105 transition-all duration-300 text-sm md:text-base"
          >
            {user ? "Logout" : "Signup / Login"}
          </button>
        </div>
      </div>
      <GetOrderbyuserid />
      <GetTablebyuserid/>
      </div>
    </>
  );
};

export default Profile;
