import { useCreateContact } from "../hooks/useContact";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const ContactForm = () => {
  const { mutate, isLoading } = useCreateContact();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Your Message sent successfully "); // <-- sonner toast
        reset();
        setTimeout(() => navigate("/"), 1500);
      },
      onError: () => {
        toast.error("Something went wrong "); 
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#181C14] px-4">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg shadow-amber-400/30 space-y-5"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl font-semibold text-center text-[#D4AF37]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          >
            Contact Us
          </motion.h2>

          {/* Name */}
          <motion.div variants={inputVariants} custom={0}>
            <input
              type="text"
              placeholder="Your Name"
              {...register("name", { required: "Name is required" })}
              className="w-full bg-transparent border border-amber-400/40 
              p-3 rounded text-[#D4AF37] placeholder:text-amber-300/60
              focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={inputVariants} custom={1}>
            <input
              type="email"
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full bg-transparent border border-amber-400/40 
              p-3 rounded text-[#D4AF37] placeholder:text-amber-300/60
              focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Message */}
          <motion.div variants={inputVariants} custom={2}>
            <textarea
              rows="4"
              placeholder="Your Message"
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
              })}
              className="w-full bg-transparent border border-amber-400/40 
              p-3 rounded text-[#D4AF37] placeholder:text-amber-300/60
              focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">
                {errors.message.message}
              </p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded font-medium
            bg-[#D4AF37] text-[#181C14] cursor-pointer
            hover:bg-amber-400 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default ContactForm;
