import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import Menu from "./Menu";
import { Link } from "react-router-dom";
import { useRef } from "react";

/* ================= VARIANTS ================= */

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const bgZoom = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 0.35,
    transition: { duration: 1.4, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

/* ================= COMPONENT ================= */

const Hero = () => {
  const menuRef = useRef(null);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden bg-[#181C14]">
        <Navbar />

        {/* Background Image */}
        <motion.img
          variants={bgZoom}
          initial="hidden"
          animate="visible"
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
          alt="Restaurant"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 bg-[#181C14]/85"
        />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-7xl px-6"
          >
            <div className="max-w-2xl">
              {/* Label */}
              <motion.p
                variants={itemUp}
                className="mb-4 text-sm uppercase tracking-[0.35em] text-orange-400"
              >
                Fine Dining Experience
              </motion.p>

              {/* Heading */}
              <motion.h1
                variants={itemUp}
                className="mb-6 font-serif text-5xl leading-tight text-white md:text-6xl"
              >
                Where Taste <br /> Meets Elegance
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemUp}
                className="mb-10 text-lg text-neutral-300"
              >
                A premium dining atmosphere with carefully crafted flavors.
              </motion.p>

              {/* Buttons */}
              <motion.div variants={itemUp} className="flex gap-4">
                <Link
                  to="/tables"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-orange-400 px-8 py-3 text-sm font-medium text-black shadow-lg shadow-orange-400/40"
                >
                  Reserve a Table
                </Link>

                <motion.button
                  onClick={scrollToMenu}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: "#fb923c",
                    color: "#000",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-orange-400/60 px-8 py-3 text-sm font-medium text-orange-400"
                >
                  View Menu
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div ref={menuRef}>
          <Menu />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default Hero;
