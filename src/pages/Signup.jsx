import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "cleint",
    },
  });

  // API call
  const signupUser = async (newUser) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Signup failed!");
    }
    return data;
  };

  // React Query mutation
  const { mutate, isLoading } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("Account successfully created!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Signup failed!");
    },
  });

  // Form submit handler
  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#181C14] flex items-center justify-center p-4">
      <div className="bg-[#222] rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">
          Signup
        </h1>
        <p className="text-amber-400 text-center mb-6">Apna account banayein</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div>
            <label className="block text-amber-400 font-medium mb-2">Name</label>
            <input
              type="text"
              {...register("name", { required: "name is required" })}
              className="w-full px-4 py-2 bg-[#181C14] border border-amber-400 rounded-lg text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-amber-300"
              placeholder="name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-amber-400 font-medium mb-2">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Sahi email darj karein",
                },
              })}
              className="w-full px-4 py-2 bg-[#181C14] border border-amber-400 rounded-lg text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-amber-300"
              placeholder="email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-amber-400 font-medium mb-2">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should be at least 6 characters long",
                },
              })}
              className="w-full px-4 py-2 bg-[#181C14] border border-amber-400 rounded-lg text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-amber-300"
              placeholder="password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[#181C14] font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>
        <p className="text-center text-amber-400 mt-4">
  Already have an account?{" "}
  <span
    onClick={() => navigate("/login")}
    className="text-amber-300 font-semibold cursor-pointer hover:underline"
  >
    Login
  </span>
</p>
      </div>
    </div>
  );
}
