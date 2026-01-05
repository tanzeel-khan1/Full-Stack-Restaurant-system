// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login, user } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(email, password);

//       if (user?.isAdmin) {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-[#181C14]">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-[#222] p-8 rounded-lg shadow-2xl w-96"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center text-amber-400">
//           Login
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 mb-4 rounded-lg bg-[#181C14] border border-amber-400 text-amber-400 placeholder-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-4 rounded-lg bg-[#181C14] border border-amber-400 text-amber-400 placeholder-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
//         />

//         <button
//           type="submit"
//           className="w-full bg-amber-400 hover:bg-amber-500 text-[#181C14] font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const role = await login(email, password); // login se role return hota hai

    if (role === "admin") {
      navigate("/admin"); // admin dashboard
    } else if (role === "waiter") {
      navigate("/waiter"); // Waiter dashboard route
    } else {
      navigate("/"); // fallback
    }
  } catch (err) {
    alert("Invalid credentials");
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
          className="w-full p-3 mb-4 rounded-lg bg-[#181C14] border border-amber-400 text-amber-400 placeholder-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#181C14] border border-amber-400 text-amber-400 placeholder-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 text-[#181C14] font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
