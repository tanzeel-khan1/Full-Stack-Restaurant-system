// import { createContext, useContext, useState } from "react";
// import API from "../utils/api";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const login = async (email, password) => {
//     const { data } = await API.post("/auth/login", { email, password });
//     console.log("Login response:", data);

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data));

//     setUser(data);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useContext, useState } from "react";
import API from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromStorage());

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });

    console.log("Login response:", data);

    // backend me user object kaha hai check karo
    const loggedInUser = data.user || data; // agar data.user undefined hai
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    return loggedInUser.role; // role ke hisaab se redirect
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
