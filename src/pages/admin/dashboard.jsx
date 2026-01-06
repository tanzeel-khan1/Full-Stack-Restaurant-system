import ProtectedAdmin from "../../components/ProtectedAdmin";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBox, FaTable, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const cards = [
    {
      title: "Manage Users",
      desc: "View, edit and delete registered users",
      icon: <FaUsers />,
      link: "/admin/users",
    },
    {
      title: "Manage Orders",
      desc: "Track and update customer orders",
      icon: <FaBox />,
      link: "/admin/orders",
    },
    {
      title: "Manage Tables",
      desc: "Monitor and update table status",
      icon: <FaTable />,
      link: "/admin/tables",
    },
    {
      title: "Pending Orders",
      desc: "View and update pending orders",
      icon: <FaBox />,
      link: "/admin/pending-orders",
    },
    {
      title: "Attendance Dashboard",
      desc: "View and manage attendance records",
      icon: <Clock />,
      link: "/admin/attendance-dashboard",
    },
  ];

  return (
    <ProtectedAdmin>
      <div className="min-h-screen bg-gradient-to-br from-[#181C14] via-[#1f241a] to-black text-amber-400 px-8 py-10">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-14">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent tracking-wide">
            ⚡ Admin Dashboard
          </h1>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
            <span className="text-base md:text-lg font-medium">
              Hi, <span className="font-bold">{user?.name}</span> 👋
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-red-500/50 transition-all duration-300"
            >
              <FaSignOutAlt className="text-lg" /> Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              onClick={() => navigate(card.link)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative bg-[#20251C]/90 border border-amber-500/20 p-8 rounded-2xl 
              shadow-lg shadow-amber-900/50 cursor-pointer group 
              hover:-translate-y-3 transition-all duration-300 
              hover:shadow-amber-500/70 hover:shadow-2xl"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 blur-xl"></div>

              <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black text-4xl shadow-md shadow-amber-700/50 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>

              <h3 className="relative z-10 text-2xl font-semibold mb-2">
                {card.title}
              </h3>
              <p className="relative z-10 text-sm text-gray-400">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedAdmin>
  );
}
