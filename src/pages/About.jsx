import React from "react";
import { MdDinnerDining, MdFamilyRestroom } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#181C14]">
        <motion.div
          className="bg-[#181C14] text-white py-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-[#D4AF37]">BABARBHAI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Where authentic flavors meet modern dining experience. Serving
              Karachi's finest cuisine since our beginning.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-500">
                Our journey
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed">
                BABARBHAI began as a dream to bring authentic Pakistani flavors
                to food lovers across Karachi. Founded with a passion for
                traditional recipes and a commitment to quality, we have been
                serving our community with love and dedication.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed">
                What started as a small family venture has grown into a beloved
                restaurant, but our core values remain unchanged: fresh
                ingredients, authentic recipes, and exceptional hospitality that
                makes every guest feel like family.
              </p>
              <div className="pt-4">
                <div className="w-20 h-1 bg-[#D4AF37] rounded"></div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl p-1">
                <div className="bg-[#181C14] rounded-xl h-96 flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg
                      className="w-20 h-20 mx-auto mb-4 text-[#D4AF37]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl font-semibold">Our Journey</p>
                    <p className="text-sm text-gray-300">
                      Restaurant Story Image
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#181C14] py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                These principles guide everything we do, from sourcing
                ingredients to serving our guests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: MdDinnerDining,
                  title: "Premium Quality",
                  text: "We source only the finest ingredients and maintain the highest standards in food preparation and presentation.",
                },
                {
                  icon: MdFamilyRestroom,
                  title: "Authentic Flavors",
                  text: "Traditional recipes passed down through generations, prepared with love and authentic cooking methods.",
                },
                {
                  icon: CiDeliveryTruck,
                  title: "Exceptional Service",
                  text: "Our team is dedicated to providing warm hospitality and ensuring every dining experience is memorable.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                >
                  <div className="w-20 h-20 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D4AF37] transition-colors duration-300">
                    <item.icon className="w-10 h-10 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-500 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-200">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#181C14] py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience{" "}
              <span className="text-[#D4AF37]">BABARBHAI</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join us for an unforgettable dining experience where tradition
              meets taste. Book your table today or order online for delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#D4AF37] cursor-pointer hover:bg-[#B8941F] text-[#36454f] px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                Book a Table
              </button>
              <button className="border-2 cursor-pointer border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#36454f] px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200">
                Order Online
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;
