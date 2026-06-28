import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RequireAdmin = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  console.log(
    "👑 RequireAdmin - loading:",
    loading,
    "isAdmin:",
    isAdmin,
    "user:",
    user?.nome,
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    console.log("👑 Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log("👑 Usuário não é admin, redirecionando para teams");
    return <Navigate to="/teams" replace />;
  }

  console.log("👑 Usuário admin autorizado:", user.nome);
  return children;
};

export default RequireAdmin;
