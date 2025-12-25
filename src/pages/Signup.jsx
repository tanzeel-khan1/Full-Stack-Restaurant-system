import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "waiter",
  });
  const [errors, setErrors] = useState({});

  const signupUser = async (newUser) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Signup failed!");
    }
    return data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      alert("Account successfully bana diya gaya!");
      navigate("/login");
    },
    onError: (error) => {
      alert(error.message || "Signup failed!");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name darj karna zaroori hai";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email darj karna zaroori hai";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Sahi email darj karein";
    }

    if (!formData.password) {
      newErrors.password = "Password darj karna zaroori hai";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password kam az kam 6 characters ka hona chahiye";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-[#181C14] flex items-center justify-center p-4">
      <div className="bg-[#222] rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">
          Signup
        </h1>
        <p className="text-amber-400 text-center mb-6">
          Apna account banayein
        </p>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-amber-400 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#181C14] border border-amber-400 rounded-lg text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-amber-300"
              placeholder="Apna naam darj karein"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-amber-400 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#181C14] border border-amber-400 rounded-lg text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-amber-300"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-amber-400 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#181C14] border border-amber-400 rounded-lg text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-amber-300"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[#181C14] font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </div>

        
      </div>
    </div>
  );
}
