import { useCreateContact } from "../hooks/useContact";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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
        toast.success("Your Message sent successfully ✅");

        reset();

        setTimeout(() => {
          navigate("/");
        }, 1500);
      },
      onError: () => {
        toast.error("Something went wrong ❌");
      },
    });
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" theme="dark" />

      <div className="min-h-screen flex items-center justify-center bg-[#181C14] px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-black/30 backdrop-blur-md 
          p-6 rounded-xl shadow-lg shadow-amber-400/30 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-center text-[#D4AF37]">
            Contact Us
          </h2>

          {/* Name */}
          <div>
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
          </div>

          {/* Email */}
          <div>
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
          </div>

          {/* Message */}
          <div>
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded font-medium
            bg-[#D4AF37] text-[#181C14]
            hover:bg-amber-400 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;
