import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RequireAuth = ({ children }) => {
  const { user } = useAuth(); // Remove loading

  // If useAuth suspends, this won't run until data is ready
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAuth;
