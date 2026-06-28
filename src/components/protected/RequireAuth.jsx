import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔍 Log para debug
  console.log("🔒 RequireAuth - loading:", loading, "user:", user?.nome);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    console.log("🔒 Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  console.log("🔒 Usuário autenticado:", user.nome);
  return children;
};

export default RequireAuth;
