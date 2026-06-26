import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RequireAdmin = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user || !isAdmin) return <Navigate to="/teams" replace />;
  return children;
};

export default RequireAdmin;
