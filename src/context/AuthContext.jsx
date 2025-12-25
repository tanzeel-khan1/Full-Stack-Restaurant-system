import { createContext, useContext, useState } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    console.log("Login response:", data); 

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data); 
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
