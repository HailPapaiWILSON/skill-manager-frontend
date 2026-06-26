import { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const response = await apiLogin({ email, senha });
    const { usuarioSemSenha, token } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuarioSemSenha));
    setUser(usuarioSemSenha);
    return usuarioSemSenha;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    isAdmin: user?.funcao === "administrador",
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
