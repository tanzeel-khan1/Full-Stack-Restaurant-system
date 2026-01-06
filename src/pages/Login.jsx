import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const role = await login(email, password);

      toast.success("Login successful");

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "waiter") {
        navigate("/waiter");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#181C14]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#222] p-8 rounded-lg shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-400">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#181C14] border border-amber-400 text-amber-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#181C14] border border-amber-400 text-amber-400"
          required
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-amber-400 hover:bg-amber-500 text-[#181C14] font-bold py-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-center text-amber-400 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-amber-300 font-semibold cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
