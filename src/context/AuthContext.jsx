import { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin } from "../api/autenticacao";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    console.log("🔐 AuthProvider - Inicializando...");
    console.log(
      "📦 Token no localStorage:",
      token ? "✅ Presente" : "❌ Ausente",
    );
    console.log(
      "📦 User no localStorage:",
      storedUser ? "✅ Presente" : "❌ Ausente",
    );

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("✅ Usuário carregado com sucesso:", {
          id: parsedUser.id,
          nome: parsedUser.nome,
          email: parsedUser.email,
          funcao: parsedUser.funcao,
        });
      } catch (error) {
        console.error("❌ Erro ao parsear user do localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      console.log("ℹ️ Nenhum dado de autenticação encontrado no localStorage");
    }
    setLoading(false);
    console.log("🔐 AuthProvider - Inicialização concluída. loading:", false);
  }, []);

  const login = async (email, senha) => {
    console.log("🔐 Tentando login para:", email);
    try {
      const response = await apiLogin({ email, senha });
      const { usuarioSemSenha, token } = response.data;

      console.log("✅ Login bem-sucedido:", {
        id: usuarioSemSenha.id,
        nome: usuarioSemSenha.nome,
        email: usuarioSemSenha.email,
        funcao: usuarioSemSenha.funcao,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuarioSemSenha));
      setUser(usuarioSemSenha);
      return usuarioSemSenha;
    } catch (error) {
      console.error(
        "❌ Erro no login:",
        error.response?.data?.error || error.message,
      );
      throw error;
    }
  };

  const logout = () => {
    console.log("🔐 Logout executado");
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
