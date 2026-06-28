// RequireAdmin.jsx - FIXED
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RequireAdmin = ({ children }) => {
  const { user, isAdmin } = useAuth(); // Remove 'loading'

  // ❌ REMOVE THIS: if (loading) return <div>Carregando...</div>;

  if (!user || !isAdmin) return <Navigate to="/teams" replace />;
  return children;
};

export default RequireAdmin;
