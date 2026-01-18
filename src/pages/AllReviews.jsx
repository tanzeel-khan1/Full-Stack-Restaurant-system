import React from "react";
import { useAllReviews } from "../hooks/useReview";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const AllReviews = () => {
  const { data: reviews = [], isLoading, isError } = useAllReviews();

  if (isLoading)
    return (
      <div className="bg-[#181C14] py-24 text-center text-neutral-500">
        Loading…
      </div>
    );

  if (isError)
    return (
      <div className="bg-[#181C14] py-24 text-center text-red-500">
        Error loading reviews
      </div>
    );

  return (
    <section className="bg-[#181C14] py-24">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37] mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-neutral-100">
            User's Experience
          </h2>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-12"
        >
          {reviews.slice(0, 3).map((review) => (
            <motion.div
              key={review._id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="
                relative bg-[#121212] cursor-pointer
                border border-[#2a2a2a] rounded-md
                px-8 py-10
                transition-colors duration-500
                hover:border-[#d4af37]
              "
            >
              {/* Gold top line */}

              {/* Name */}
              <p className="text-neutral-100 font-medium tracking-wide mb-3">
                {review.userName}
              </p>

              {/* Rating */}
              <div className="flex mb-8">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < review.rating
                        ? "text-[#d4af37]"
                        : "text-neutral-700"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              <p className="text-neutral-300 text-[15px] leading-loose">
                {review.comment}
              </p>

              {/* Subtle glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition duration-500"
                style={{
                  boxShadow: "0 0 80px rgba(212,175,55,0.10)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AllReviews;
