import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="bg-[#181C14] shadow-orange-400 relative z-50 backdrop-blur-sm"
      style={{ boxShadow: "0 4px 8px rgba(261, 146, 60, 0.5)" }} // orange-400
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-amber-400 md:ml-0 ml-6 font-bold text-xl sm:text-2xl lg:text-3xl tracking-wider hover:text-amber-300 transition-colors duration-300 cursor-pointer">
              BABARBHAI
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="/dashboard"
              className="text-amber-400 hover:text-amber-500 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/about"
              className="text-amber-400 hover:text-amber-400 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="/location"
              className="text-amber-400 hover:text-amber-400 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Location
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/contact"
              className="text-amber-400 hover:text-amber-400 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/profile"
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-800 px-4 lg:px-6 py-2 rounded-lg text-sm lg:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Profile
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-200 cursor-pointer hover:text-amber-400 p-2 transition-all duration-300 hover:bg-slate-700 rounded-md"
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen
            ? "max-h-80 opacity-100 transform translate-y-0"
            : "max-h-0 opacity-0 transform -translate-y-2"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3 bg-[#181C14] shadow-inner border-t border-slate-600">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "About", path: "/about" },
            { name: "Location", path: "/location" },
            { name: "Contact", path: "/contact" },

            { name: "Profile", path: "/profile" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                item.name === "Contact"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-800 font-semibold hover:from-amber-600 hover:to-amber-500 shadow-lg"
                  : "text-slate-200 hover:text-amber-400 hover:bg-slate-700 border border-transparent hover:border-amber-400/30"
              }`}
              onClick={closeMenu}
            >
              <span className="flex items-center">
                {item.name}
                <svg
                  className="w-4 h-4 ml-auto opacity-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden -z-10"
          onClick={closeMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
