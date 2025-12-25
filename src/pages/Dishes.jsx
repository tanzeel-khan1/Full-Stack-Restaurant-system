import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

// ✅ Custom hooks
import { useDishById, useCreateDish, useUpdateDish } from "../hooks/useDishes";

const DishForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      available: true,
    },
  });

  // ✅ Get dish by id if editing
  const { data: dishData } = useDishById(id);

  // ✅ Pre-fill form values when data loads
  if (dishData) {
    Object.keys(dishData).forEach((key) => {
      setValue(key, dishData[key]);
    });
  }

  // ✅ Mutations
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();

  const onSubmit = (formData) => {
    if (id) {
      updateDish.mutate(
        { id, updatedDish: formData },
        {
          onSuccess: (res) => {
            toast.success(res?.message || "Dish updated successfully!");
            setTimeout(() => navigate("/"), 1500);
          },
          onError: (err) => {
            toast.error(err.response?.data?.message || "Something went wrong!");
          },
        }
      );
    } else {
      createDish.mutate(formData, {
        onSuccess: (res) => {
          toast.success(res?.message || "Dish created successfully!");
          setTimeout(() => navigate("/"), 1500);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "Something went wrong!");
        },
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/5 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white border-opacity-20"
        >
          <h1 className="text-4xl font-extrabold text-center mb-8 text-[#D4AF37]">
            {id ? "Edit Dish" : "Add Dish"}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {["name", "category", "price", "image"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "price" ? "number" : "text"}
                  {...register(field, { required: true })}
                  placeholder=" "
                  className="peer w-full p-4 rounded-xl bg-[#2e3a48] text-white placeholder-transparent border border-white border-opacity-30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition"
                />
                <label className="absolute left-4 top-4 text-gray-300 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D4AF37] peer-focus:text-sm transition-all">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">
                    {field} is required
                  </p>
                )}
              </div>
            ))}

            <div className="relative">
              <textarea
                {...register("description", { required: true })}
                placeholder=" "
                rows="4"
                className="peer w-full p-4 rounded-xl bg-[#2e3a47] text-white placeholder-transparent border border-white border-opacity-30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none transition"
              ></textarea>
              <label className="absolute left-4 top-4 text-gray-300 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D4AF37] peer-focus:text-sm transition-all">
                Description
              </label>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  Description is required
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 text-white font-medium">
              <input
                type="checkbox"
                {...register("available")}
                className="w-6 h-6 text-[#D4AF37] border-white border rounded-lg focus:ring-2 focus:ring-[#D4AF37] transition"
              />
              Available
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={createDish.isLoading || updateDish.isLoading}
              className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1f2937] font-bold text-lg shadow-lg transition-all"
            >
              {createDish.isLoading || updateDish.isLoading
                ? "Saving..."
                : id
                ? "Update Dish"
                : "Add Dish"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={9000} />
    </>
  );
};

export default DishForm;
